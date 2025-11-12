import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  XCircle,
  AlertTriangle,
  Target,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  TrendingDown,
  Scan,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import * as pdfjsLib from "pdfjs-dist";
import { createWorker } from "tesseract.js";
import { supabase } from "@/integrations/supabase/client";
import { generateResumePDF } from "@/utils/pdfGenerator";
import { FaangPathTemplate } from "./templates/FaangPathTemplate";
import { getGroqApiKey } from "@/lib/ai/groqKeyRotation";

// ------------------------- Types -------------------------

type SectionAnalysis = {
  name: string;
  status: "Good" | "Needs Improvement" | "Missing";
  issues: string[];
  severity: "High" | "Medium" | "Low";
};

type Recommendation = {
  priority: number;
  title: string;
  description: string;
  example: string;
};

type KeywordItem = {
  keyword: string;
  present: boolean;
};

type CategoryScore = {
  name: string;
  score: number;
  maxScore: number;
  rationale: string;
  percentage: number;
};

type AnalysisResult = {
  score: number;
  rationale: string;
  categoryScores: CategoryScore[];
  sections: SectionAnalysis[];
  keywords: KeywordItem[];
  recommendations: Recommendation[];
  fullText: string;
};

// ------------------------- Component -------------------------

export const ResumeATSAnalyzer: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [previousAnalysis, setPreviousAnalysis] = useState<AnalysisResult | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [previousFileName, setPreviousFileName] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [ocrProgress, setOcrProgress] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1.5);
  const [fitToWidth, setFitToWidth] = useState(false);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isFixing, setIsFixing] = useState(false);
  const [fixedResumeText, setFixedResumeText] = useState<string>("");
  const [extractedText, setExtractedText] = useState<string>("");
  const [fixedResumeData, setFixedResumeData] = useState<any>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [matchPercentage, setMatchPercentage] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reUploadInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Configure PDF.js worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as any).version}/pdf.worker.min.js`;

  // ------------------------- PDF Rendering -------------------------

  const renderPDFPage = async (pdfDoc: any, pageNum: number, scale?: number) => {
    if (!canvasRef.current) return;

    const page = await pdfDoc.getPage(pageNum);
    let effectiveScale = scale ?? zoomLevel;
    
    // Calculate fit-to-width scale if enabled
    if (fitToWidth && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth - 32; // subtract padding
      const pageViewport = page.getViewport({ scale: 1.0 });
      effectiveScale = containerWidth / pageViewport.width;
    }
    
    const viewport = page.getViewport({ scale: effectiveScale });
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvas, canvasContext: context, viewport }).promise;
  };

  const generateThumbnails = async (pdf: any) => {
    const thumbs: string[] = [];
    const thumbnailScale = 0.2; // Small scale for thumbnails

    for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) { // Limit to 20 pages for performance
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: thumbnailScale });
      
      const thumbCanvas = document.createElement('canvas');
      const thumbContext = thumbCanvas.getContext('2d');
      
      if (!thumbContext) continue;
      
      thumbCanvas.height = viewport.height;
      thumbCanvas.width = viewport.width;
      
      await page.render({ canvas: thumbCanvas, canvasContext: thumbContext, viewport }).promise;
      thumbs.push(thumbCanvas.toDataURL());
    }
    
    setThumbnails(thumbs);
  };

  const loadPDFPreview = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setNumPages(pdf.numPages);
      setCurrentPage(1);
      setZoomLevel(1.5);
      setFitToWidth(false);
      await renderPDFPage(pdf, 1);
      setPdfFile(file);
      
      // Generate thumbnails in background
      if (pdf.numPages > 1) {
        generateThumbnails(pdf);
      }
    } catch (error) {
      console.error("Error loading PDF preview:", error);
      toast({ title: "Preview error", description: "Could not load PDF preview", variant: "destructive" });
    }
  };

  const changePage = async (newPage: number) => {
    if (!pdfFile || newPage < 1 || newPage > numPages) return;

    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    await renderPDFPage(pdf, newPage);
    setCurrentPage(newPage);
  };

  const handleZoomIn = async () => {
    if (!pdfFile) return;
    const newZoom = Math.min(zoomLevel + 0.25, 3.0);
    setZoomLevel(newZoom);
    setFitToWidth(false);
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    await renderPDFPage(pdf, currentPage, newZoom);
  };

  const handleZoomOut = async () => {
    if (!pdfFile) return;
    const newZoom = Math.max(zoomLevel - 0.25, 0.5);
    setZoomLevel(newZoom);
    setFitToWidth(false);
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    await renderPDFPage(pdf, currentPage, newZoom);
  };

  const handleResetZoom = async () => {
    if (!pdfFile) return;
    setZoomLevel(1.5);
    setFitToWidth(false);
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    await renderPDFPage(pdf, currentPage, 1.5);
  };

  const handleFitToWidth = async () => {
    if (!pdfFile) return;
    setFitToWidth(!fitToWidth);
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    await renderPDFPage(pdf, currentPage);
  };

  // ------------------------- Fix Resume Functionality -------------------------

  const handleFixResume = async () => {
    if (!extractedText) {
      toast({ title: "Error", description: "Please analyze a resume first", variant: "destructive" });
      return;
    }

    setIsFixing(true);
    try {
      const missingKeywords = analysisResult?.recommendations
        .map(rec => rec.description)
        .filter(desc => desc.toLowerCase().includes("keyword") || desc.toLowerCase().includes("missing"))
        .join(", ") || "";

      const { data, error } = await supabase.functions.invoke('generate-resume', {
        body: {
          resumeText: extractedText,
          desiredJobRole: "Optimized for ATS",
          keywords: missingKeywords || "professional, achievement-oriented, results-driven"
        }
      });

      if (error) throw error;

      if (data?.generatedResume) {
        const resumeData = data.generatedResume;
        setFixedResumeText(JSON.stringify(resumeData, null, 2));
        setFixedResumeData(resumeData);
        toast({ title: "Success", description: "Resume enhanced successfully! Review and download below." });
      } else {
        throw new Error("No enhanced resume returned");
      }
    } catch (error) {
      console.error("Error fixing resume:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to enhance resume",
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
    }
  };

  const handleDownloadFixedPDF = async () => {
    if (!fixedResumeData) return;
    
    setIsGeneratingPDF(true);
    try {
      await generateResumePDF("enhanced-resume-preview", "enhanced-resume.pdf");
      toast({ title: "Success", description: "Enhanced resume PDF downloaded successfully!" });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadFixed = () => {
    if (!fixedResumeText) return;
    
    const blob = new Blob([fixedResumeText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enhanced-resume.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: "Enhanced resume downloaded successfully!" });
  };

  // ------------------------- Text Extraction -------------------------

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n\n";
    }

    return fullText.trim();
  };

  const extractTextWithOCR = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    setOcrProgress("Initializing OCR...");

    const worker = await createWorker("eng", 1, {
      logger: (m: any) => {
        if (m.progress) {
          const pct = Math.round(m.progress * 100);
          setOcrProgress(`${m.status} ${pct}%`);
        }
      },
    });

    try {

      for (let i = 1; i <= pdf.numPages; i++) {
        setOcrProgress(`Processing page ${i} of ${pdf.numPages}...`);

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvas, canvasContext: context, viewport }).promise;
        const imageData = canvas.toDataURL("image/png");

        const { data } = await worker.recognize(imageData);
        fullText += data.text + "\n\n";
      }
    } finally {
      try {
        await worker.terminate();
      } catch (e) {
        console.warn("Failed to terminate OCR worker:", e);
      }
      setOcrProgress("");
    }

    return fullText.trim();
  };

  // ------------------------- File handling & analysis -------------------------

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isReUpload = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({ title: "Invalid file type", description: "Please upload a PDF file", variant: "destructive" });
      return;
    }

    if (isReUpload && analysisResult) {
      setPreviousAnalysis(analysisResult);
      setPreviousFileName(uploadedFileName);
      setShowComparison(true);
    }

    setUploadedFileName(file.name);
    await loadPDFPreview(file);

    setIsAnalyzing(true);

    try {
      toast({ title: "Extracting text from PDF", description: "Analyzing document..." });

      let extractedTextLocal = await extractTextFromPDF(file);

      // If little text, treat as scanned and fall back to OCR
      if (!extractedTextLocal || extractedTextLocal.length < 50) {
        toast({ title: "Scanned PDF detected", description: "Running OCR to extract text..." });
        extractedTextLocal = await extractTextWithOCR(file);

        if (!extractedTextLocal || extractedTextLocal.length < 50) {
          throw new Error("Could not extract text from the PDF. Please ensure the file is readable.");
        }

        toast({ title: "OCR completed", description: "Successfully extracted text from scanned document" });
      }

      setExtractedText(extractedTextLocal);

      // Build prompt for Grok (xAI). You can tweak the system/user messages for better structure.
      let prompt = `You are an expert resume reviewer. Analyze the resume below for ATS compatibility and provide:
1) A single ATS score (0-100).
2) A short rationale/summary.
3) Category breakdown (Formatting & Structure, Keywords & Skills, Experience & Achievements, Education & Certifications, Overall Presentation) each with a score and short rationale.
4) Section-by-section analysis (Header/Contact, Summary, Experience, Education, Skills, Certifications, Other) with status (Good / Needs Improvement / Missing), issues, and severity.
5) Prioritized recommendations (at least 5) with short examples.
6) Two keyword lists: under the headings "Keywords present:" and "Keywords missing:" as simple comma-separated lists.`;

      if (jobDescription.trim()) {
        prompt += `
7) Job description match percentage (0-100%) showing how well the resume matches the job requirements.

Job Description:
---
${jobDescription}
---
`;
      }

      prompt += `

Resume text:
---
${extractedTextLocal}
---`;

      // Grok endpoint and key from environment
      const GROK_URL = "https://api.groq.com/openai/v1/chat/completions";
      
      // Use key rotation system to get API key (supports single key, comma-separated keys, or numbered keys)
      let GROK_KEY: string;
      try {
        GROK_KEY = getGroqApiKey();
      } catch (error: any) {
        // Fallback to direct env check if key rotation fails
        const singleKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_GROK_API_KEY;
        const multipleKeys = import.meta.env.VITE_GROQ_API_KEYS;
        
        if (singleKey) {
          GROK_KEY = singleKey;
        } else if (multipleKeys) {
          // Use first key from comma-separated list
          const keys = multipleKeys.split(',').map(k => k.trim()).filter(k => k);
          if (keys.length > 0) {
            GROK_KEY = keys[0];
          } else {
            throw new Error("Grok API key not found. Set VITE_GROQ_API_KEY, VITE_GROK_API_KEY, or VITE_GROQ_API_KEYS in your .env file.");
          }
        } else {
          throw new Error("Grok API key not found. Set VITE_GROQ_API_KEY, VITE_GROK_API_KEY, or VITE_GROQ_API_KEYS in your .env file.");
        }
      }

      // We'll call the Grok chat completions endpoint similarly to OpenAI's chat API.
      // Adjust the request payload if you want to use a different grok model or API variant.
      const resp = await fetch(GROK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROK_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0,
          max_tokens: 2048,
          stream: false, // or true if you want to handle streaming
        }),
      });

      if (!resp.ok) {
        if (resp.status === 401) throw new Error("Unauthorized. Check your Grok API key.");
        if (resp.status === 429) throw new Error("Rate limit exceeded. Please try again later.");
        throw new Error(`Analysis service returned ${resp.status}: ${resp.statusText}`);
      }

      // Parse the non-streaming JSON response
      const data = await resp.json();
      console.log("Groq API Response:", data);
      
      const fullResponse = data.choices?.[0]?.message?.content || "";
      
      if (!fullResponse) {
        throw new Error("No content received from AI service");
      }

      const parsedResult = parseAnalysisResponse(fullResponse);
      setAnalysisResult(parsedResult);
      
      // Extract match percentage if job description was provided
      if (jobDescription.trim()) {
        const matchMatch = fullResponse.match(/(?:match percentage|job match|percentage match)[:\s]*([0-9]{1,3})%?/i);
        if (matchMatch) {
          setMatchPercentage(parseInt(matchMatch[1], 10));
        }
      }

      toast({ title: "Analysis complete", description: `ATS Score: ${parsedResult.score}/100` });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze resume",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ------------------------- Response parsing -------------------------

  const parseAnalysisResponse = (response: string): AnalysisResult => {
    console.log("Full AI Response:", response);

    // Extract overall score - handle bold markdown format like **48 / 100**
    const scoreMatch =
      response.match(/\*\*\s*([0-9]{1,3})\s*\/\s*100\s*\*\*/i) ||
      response.match(/(?:ATS\s*score|score|Score)[:\s]*\*?\*?([0-9]{1,3})/i) ||
      response.match(/([0-9]{1,3})\s*\/\s*100/i) ||
      response.match(/([0-9]{1,3})\s*out of 100/i);
    const score = scoreMatch ? Math.max(0, Math.min(100, parseInt(scoreMatch[1], 10))) : 0;
    
    console.log("Extracted Score:", score);

    // Category parsing - handle markdown table format
    const categoryScores: CategoryScore[] = [];
    
    // Extract table rows between "Category" header and next section
    const categoryTableMatch = response.match(/\|\s*Category\s*\|[\s\S]*?\n([\s\S]*?)(?:\n\n|\*\*Overall ATS Score)/i);
    
    if (categoryTableMatch) {
      const tableRows = categoryTableMatch[1].split('\n').filter(line => line.includes('|') && !line.includes('---'));
      
      tableRows.forEach(row => {
        const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
        if (cells.length >= 3) {
          const name = cells[0].replace(/\*\*/g, '').trim();
          const scoreText = cells[1].replace(/\*\*/g, '').trim();
          const rationale = cells[2].replace(/\*\*/g, '').trim();
          
          const scoreNum = parseInt(scoreText, 10) || 0;
          
          categoryScores.push({
            name,
            score: scoreNum,
            maxScore: 100,
            rationale,
            percentage: scoreNum,
          });
        }
      });
    }
    
    console.log("Extracted Categories:", categoryScores);

    const rationaleMatch = response.match(
      /(?:rationale|summary|analysis)[:\s]*(.*?)(?:\n\n|Section-by-section|Categories|Category|Recommendations)/is,
    );
    const rationale = rationaleMatch ? rationaleMatch[1].trim() : `Scored ${score}/100.`;

    // Helpers to parse markdown tables reliably
    const parseTableRows = (headerRegex: RegExp): string[][] => {
      const startIdx = response.search(headerRegex);
      if (startIdx === -1) return [];
      const after = response.slice(startIdx);
      const lines = after.split("\n");
      // Find the separator row (|---|---|)
      let sepIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        if (/\|\s*-{3,}/.test(lines[i])) { sepIdx = i; break; }
      }
      if (sepIdx === -1) return [];
      const rows: string[][] = [];
      for (let i = sepIdx + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || !line.includes("|")) break; // end of table
        if (/^\s*-{3,}\s*$/.test(line)) break;
        const cellsRaw = line.split("|").map(c => c.trim());
        if (cellsRaw[0] === "") cellsRaw.shift();
        if (cellsRaw[cellsRaw.length - 1] === "") cellsRaw.pop();
        rows.push(cellsRaw);
      }
      return rows;
    };

    const normalizeSeverity = (s: string): "High" | "Medium" | "Low" => {
      const v = s.toLowerCase();
      if (/(critical|severe|major|high)/.test(v)) return "High";
      if (/(minor|low|trivial|small)/.test(v)) return "Low";
      return "Medium";
    };

    // Sections parsing - handle markdown table format
    const sections: SectionAnalysis[] = [];
    const sectionRows = parseTableRows(/\|\s*Section\s*\|/i);
    sectionRows.forEach(cells => {
      if (cells.length >= 4) {
        const name = cells[0].replace(/\*\*/g, '').trim();
        const status = cells[1].replace(/\*\*/g, '').trim() as SectionAnalysis["status"];
        const issuesText = cells[2].replace(/\*\*/g, '').trim();
        const severity = normalizeSeverity(cells[3].replace(/\*\*/g, '').trim());
        const issues = issuesText
          .split(/[;,]/)
          .map(s => s.trim())
          .filter(s => s && !/(none|n\/a)/i.test(s));
        sections.push({ name, status, issues: issues.length ? issues : [issuesText], severity });
      }
    });
    
    console.log("Extracted Sections:", sections);

    // keywords
    const keywords: KeywordItem[] = [];
    const presentMatch = response.match(
      /(?:Keywords present|Present keywords|Keywords found)[:\s]*([\s\S]*?)(?:\n\n|Missing|Recommendations|$)/i,
    );
    if (presentMatch) {
      const items = presentMatch[1].match(/"([^"]+)"|'([^']+)'|[\w\+\#\-]+/g);
      if (items) items.forEach((t) => keywords.push({ keyword: t.replace(/["']/g, ""), present: true }));
    }
    const missingMatch = response.match(
      /(?:Keywords missing|Missing keywords)[:\s]*([\s\S]*?)(?:\n\n|Recommendations|$)/i,
    );
    if (missingMatch) {
      const items = missingMatch[1].match(/"([^"]+)"|'([^']+)'|[\w\+\#\-]+/g);
      if (items) items.forEach((t) => keywords.push({ keyword: t.replace(/["']/g, ""), present: false }));
    }

    // Recommendations - extract from table format
    const recommendations: Recommendation[] = [];
    
    // Extract recommendations table rows
    const recTableMatch = response.match(/\|\s*#\s*\|[\s\S]*?\n([\s\S]*?)(?:\n\n|$)/i);
    
    if (recTableMatch) {
      const tableRows = recTableMatch[1].split('\n').filter(line => line.includes('|') && !line.includes('---'));
      
      tableRows.forEach(row => {
        const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
        if (cells.length >= 3) {
          const priority = parseInt(cells[0].replace(/\*\*/g, '').trim(), 10) || 1;
          const title = cells[1].replace(/\*\*/g, '').trim();
          const description = cells[2].replace(/\*\*/g, '').trim();
          const example = cells[3] ? cells[3].replace(/\*\*/g, '').replace(/<br\s*\/?>/gi, '\n').trim() : "";
          
          recommendations.push({ priority, title, description, example });
        }
      });
    }
    
    console.log("Extracted Recommendations:", recommendations);
    
    // Fallback: try to extract numbered recommendations
    if (!recommendations.length) {
      let idx = 1;
      const numbered = response.matchAll(/\|\s*\*\*(\d+)\*\*\s*\|\s*\*\*(.+?)\*\*\s*\|/g);
      for (const entry of numbered) {
        if (idx > 10) break;
        const title = entry[2].trim();
        recommendations.push({
          priority: idx++,
          title,
          description: "See detailed analysis above",
          example: "",
        });
      }
    }

    // Another fallback: simple numbered list
    if (!recommendations.length) {
      const bullets = response.match(/(?:-\s+)([A-Z][^\n]{10,200})/g);
      if (bullets) {
        bullets.slice(0, 10).forEach((b, i) => {
          recommendations.push({
            priority: i + 1,
            title: b.replace(/^\-\s*/, "").slice(0, 60),
            description: b.replace(/^\-\s*/, ""),
            example: "",
          });
        });
      }
    }

    return {
      score,
      rationale,
      categoryScores,
      sections,
      keywords,
      recommendations,
      fullText: response,
    };
  };

  // ------------------------- Utilities & UI helpers -------------------------

  const resetAnalyzer = () => {
    setAnalysisResult(null);
    setPreviousAnalysis(null);
    setUploadedFileName("");
    setPreviousFileName("");
    setShowComparison(false);
    setPdfFile(null);
    setCurrentPage(1);
    setNumPages(0);
    setZoomLevel(1.5);
    setFitToWidth(false);
    setThumbnails([]);
    setJobDescription("");
    setMatchPercentage(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (reUploadInputRef.current) reUploadInputRef.current.value = "";
  };

  const getScoreChange = () => {
    if (!previousAnalysis || !analysisResult) return null;
    return analysisResult.score - previousAnalysis.score;
  };

  const getScoreChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  const getScoreChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-5 h-5" />;
    if (change < 0) return <TrendingDown className="w-5 h-5" />;
    return null;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Work";
    return "Poor";
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "High":
        return <XCircle className="w-4 h-4 text-destructive" />;
      case "Medium":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "Low":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "destructive";
      case "Medium":
        return "secondary";
      case "Low":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Good":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "Needs Improvement":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "Missing":
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good":
        return "bg-green-50 border-green-200";
      case "Needs Improvement":
        return "bg-yellow-50 border-yellow-200";
      case "Missing":
        return "bg-red-50 border-red-200";
      default:
        return "bg-muted";
    }
  };

  // ------------------------- Render -------------------------

  return (
    <Card className="flex flex-col min-h-[600px] bg-background">
      <div className="p-6 border-b bg-gradient-primary">
        <h2 className="text-2xl font-bold text-white">ATS Resume Analyzer</h2>
        <p className="text-sm text-white/90">Upload your resume to get an instant ATS compatibility score</p>
      </div>

      <ScrollArea className="flex-1 p-6">
        {!analysisResult && !isAnalyzing && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
            <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <div className="max-w-md">
              <h3 className="text-2xl font-bold text-foreground mb-3">Check Your Resume's ATS Score</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Upload your resume and get instant feedback on ATS compatibility, formatting issues, and areas for
                improvement
              </p>

              <div className="bg-muted/50 rounded-lg p-4 mb-6 border border-border">
                <p className="text-sm font-semibold text-foreground mb-3">What you'll get:</p>
                <div className="text-left space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">ATS compatibility score (0-100)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">Section-by-section analysis</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">Specific improvement recommendations</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">Keyword and formatting analysis</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Job Description (Optional)
                </label>
                <Textarea
                  placeholder="Paste the job description here to get a match percentage..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Add a job description to see how well your resume matches the role
                </p>
              </div>

              <Button
                onClick={() => fileInputRef.current?.click()}
                size="lg"
                className="gradient-primary hover:gradient-primary-hover w-full"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Resume (PDF)
              </Button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center h-full space-y-6 py-12">
            {ocrProgress ? (
              <>
                <div className="relative">
                  <Loader2 className="w-16 h-16 animate-spin text-primary" />
                  <Scan className="w-8 h-8 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center max-w-md">
                  <h3 className="text-xl font-bold text-foreground mb-2">Running OCR</h3>
                  <p className="text-sm text-muted-foreground mb-2">{ocrProgress}</p>
                  <div className="bg-muted/50 rounded-lg p-3 border border-border">
                    <p className="text-xs text-muted-foreground">
                      This document appears to be scanned or image-based. We're using OCR technology to extract the
                      text.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Loader2 className="w-16 h-16 animate-spin text-primary" />
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground mb-2">Analyzing Your Resume</h3>
                  <p className="text-sm text-muted-foreground">Checking ATS compatibility and formatting...</p>
                </div>
              </>
            )}
          </div>
        )}

        {analysisResult && !isAnalyzing && (
          <div className="space-y-6">
            {/* Header with filename */}
            <div className="flex items-center justify-between pb-4 border-b flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">{uploadedFileName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => reUploadInputRef.current?.click()}
                  variant="default"
                  size="sm"
                  className="gradient-primary hover:gradient-primary-hover"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Improved Version
                </Button>
                <Button onClick={resetAnalyzer} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
              </div>
            </div>

            {/* Comparison Banner */}
            {showComparison && previousAnalysis && (
              <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Previous</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-muted-foreground">{previousAnalysis.score}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{previousFileName}</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-primary" />
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Current</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${getScoreColor(analysisResult.score)}`}>
                          {analysisResult.score}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{uploadedFileName}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    {getScoreChange() !== null && (
                      <div className={`flex items-center gap-2 ${getScoreChangeColor(getScoreChange()!)}`}>
                        {getScoreChangeIcon(getScoreChange()!)}
                        <span className="text-3xl font-bold">
                          {getScoreChange()! > 0 ? "+" : ""}
                          {getScoreChange()}
                        </span>
                        <span className="text-sm">points</span>
                      </div>
                    )}
                    {getScoreChange()! > 0 && (
                      <p className="text-xs text-green-600 font-semibold mt-1">Great improvement! 🎉</p>
                    )}
                    {getScoreChange()! < 0 && (
                      <p className="text-xs text-red-600 font-semibold mt-1">Score decreased</p>
                    )}
                    {getScoreChange()! === 0 && (
                      <p className="text-xs text-muted-foreground font-semibold mt-1">No change</p>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Resume Preview and Analysis Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* PDF Preview */}
              {pdfFile && (
                <div className="lg:sticky lg:top-4 lg:self-start">
                  <Card className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Resume Preview
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          Page {currentPage} / {numPages}
                        </span>
                      </div>

                      {/* Zoom Controls */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleZoomOut}
                            disabled={zoomLevel <= 0.5}
                            title="Zoom Out"
                          >
                            <ZoomOut className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResetZoom}
                            title="Reset Zoom (100%)"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleZoomIn}
                            disabled={zoomLevel >= 3.0}
                            title="Zoom In"
                          >
                            <ZoomIn className="w-4 h-4" />
                          </Button>
                          <Button
                            variant={fitToWidth ? "default" : "outline"}
                            size="sm"
                            onClick={handleFitToWidth}
                            title="Fit to Width"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <span className="text-xs text-muted-foreground">
                          {Math.round((fitToWidth ? zoomLevel : zoomLevel / 1.5) * 100)}%
                        </span>
                      </div>

                      {/* Page Navigation */}
                      {numPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage <= 1}
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage >= numPages}
                          >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* PDF Canvas */}
                    <div ref={containerRef} className="border border-border rounded-lg overflow-auto bg-white mt-3 max-h-[600px]">
                      <canvas ref={canvasRef} className="mx-auto" />
                    </div>

                    {/* Page Thumbnails */}
                    {thumbnails.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Pages</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {thumbnails.map((thumb, idx) => (
                            <button
                              key={idx}
                              onClick={() => changePage(idx + 1)}
                              className={`flex-shrink-0 border-2 rounded transition-all hover:border-primary ${
                                currentPage === idx + 1 ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                              }`}
                              title={`Go to page ${idx + 1}`}
                            >
                              <img
                                src={thumb}
                                alt={`Page ${idx + 1}`}
                                className="w-16 h-20 object-contain bg-white"
                              />
                              <div className="text-[10px] text-center py-0.5 bg-muted">
                                {idx + 1}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* Analysis Results */}
              <div className="space-y-6">
                {/* ATS Score Display */}
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className={`text-6xl font-bold ${getScoreColor(analysisResult.score)}`}>
                        {analysisResult.score}
                      </div>
                      <div className="text-left">
                        <div className="text-2xl font-bold text-muted-foreground">/100</div>
                        <div className={`text-sm font-semibold ${getScoreColor(analysisResult.score)}`}>
                          {getScoreLabel(analysisResult.score)}
                        </div>
                      </div>
                    </div>
                    <Progress value={analysisResult.score} className="h-3" />
                    <p className="text-sm text-muted-foreground">{analysisResult.rationale}</p>
                  </div>
                </Card>

                {/* Job Match Percentage */}
                {matchPercentage !== null && jobDescription.trim() && (
                  <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <div className="text-center space-y-4">
                      <h3 className="text-lg font-bold text-foreground flex items-center justify-center gap-2">
                        <Target className="w-5 h-5 text-green-600" />
                        Job Description Match
                      </h3>
                      <div className="flex items-center justify-center gap-3">
                        <div className={`text-6xl font-bold ${matchPercentage >= 80 ? 'text-green-600' : matchPercentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {matchPercentage}
                        </div>
                        <div className="text-left">
                          <div className="text-2xl font-bold text-muted-foreground">%</div>
                          <div className={`text-sm font-semibold ${matchPercentage >= 80 ? 'text-green-600' : matchPercentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {matchPercentage >= 80 ? 'Great Match' : matchPercentage >= 60 ? 'Good Match' : 'Needs Work'}
                          </div>
                        </div>
                      </div>
                      <Progress value={matchPercentage} className="h-3" />
                      <p className="text-sm text-muted-foreground">
                        Your resume matches {matchPercentage}% of the job requirements
                      </p>
                    </div>
                  </Card>
                )}

                {/* Category Breakdown */}
                {analysisResult.categoryScores.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Score Breakdown by Category
                    </h3>
                    <div className="space-y-4">
                      {analysisResult.categoryScores.map((category, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">{category.name}</span>
                              <Badge
                                variant={
                                  category.percentage >= 70
                                    ? "default"
                                    : category.percentage >= 50
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {category.percentage}%
                              </Badge>
                            </div>
                            <span className={`text-lg font-bold ${getScoreColor(category.percentage)}`}>
                              {category.score}/{category.maxScore}
                            </span>
                          </div>
                          <Progress value={category.percentage} className="h-2" />
                          <p className="text-xs text-muted-foreground">{category.rationale}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Detailed Analysis Tabs */}
            <Tabs defaultValue="sections" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sections">Sections Analysis</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="sections" className="space-y-4 mt-4">
                <Card className="p-4 bg-muted/30">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Section-by-Section Breakdown
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Review each section of your resume and identify areas that need attention
                  </p>
                </Card>

                {analysisResult.sections.length > 0 ? (
                  <div className="grid gap-4">
                    {analysisResult.sections.map((section, idx) => (
                      <Card key={idx} className={`p-4 border-2 ${getStatusColor(section.status)}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(section.status)}
                            <h4 className="font-bold text-foreground">{section.name}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getSeverityColor(section.severity) as any}>
                              {section.severity} Priority
                            </Badge>
                          </div>
                        </div>

                        {section.issues.length > 0 && (
                          <div className="space-y-2 ml-7">
                            <p className="text-sm font-semibold text-muted-foreground">Issues found:</p>
                            {section.issues.map((issue, issueIdx) => (
                              <div key={issueIdx} className="flex items-start gap-2">
                                {getSeverityIcon(section.severity)}
                                <p className="text-sm text-muted-foreground">{issue}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.issues.length === 0 && section.status === "Good" && (
                          <p className="text-sm text-green-600 ml-7">✓ This section looks great!</p>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-6 text-center">
                    <p className="text-sm text-muted-foreground">No detailed section analysis available</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="keywords" className="space-y-4 mt-4">
                <Card className="p-4 bg-muted/30">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Keyword Analysis
                  </h3>
                  <p className="text-xs text-muted-foreground">Key terms that ATS systems look for in your resume</p>
                </Card>

                {analysisResult.keywords.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4 border-2 border-green-200 bg-green-50">
                      <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Keywords Present
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.keywords
                          .filter((k) => k.present)
                          .map((kw, idx) => (
                            <Badge key={idx} variant="outline" className="bg-green-100 border-green-300 text-green-800">
                              {kw.keyword}
                            </Badge>
                          ))}
                        {analysisResult.keywords.filter((k) => k.present).length === 0 && (
                          <p className="text-sm text-muted-foreground">No keywords detected</p>
                        )}
                      </div>
                    </Card>

                    <Card className="p-4 border-2 border-red-200 bg-red-50">
                      <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-destructive" />
                        Keywords Missing
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.keywords
                          .filter((k) => !k.present)
                          .map((kw, idx) => (
                            <Badge key={idx} variant="outline" className="bg-red-100 border-red-300 text-red-800">
                              {kw.keyword}
                            </Badge>
                          ))}
                        {analysisResult.keywords.filter((k) => !k.present).length === 0 && (
                          <p className="text-sm text-muted-foreground">All relevant keywords present!</p>
                        )}
                      </div>
                    </Card>
                  </div>
                ) : (
                  <Card className="p-6 text-center">
                    <p className="text-sm text-muted-foreground">No keyword analysis available</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4 mt-4">
                <Card className="p-4 bg-muted/30">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Prioritized Action Items
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Follow these recommendations to improve your ATS score
                  </p>
                </Card>

                {analysisResult.recommendations.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {analysisResult.recommendations.map((rec, idx) => (
                      <AccordionItem key={idx} value={`item-${idx}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                              {rec.priority}
                            </div>
                            <span className="font-semibold">{rec.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="ml-11 space-y-3 pt-2">
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                            <div className="p-3 bg-muted rounded-lg border border-border">
                              <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Example:
                              </p>
                              <p className="text-sm text-foreground">
                                {rec.example || "See recommendation details above."}
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <Card className="p-6 text-center">
                    <p className="text-sm text-muted-foreground">No specific recommendations available</p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Fix Resume Section */}
            {analysisResult && (
              <Card className="p-6 mt-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      AI Resume Enhancement
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Let AI optimize your resume based on the ATS analysis and recommendations
                    </p>
                  </div>
                  <Button 
                    onClick={handleFixResume} 
                    disabled={isFixing || !extractedText}
                    className="gap-2"
                    size="lg"
                  >
                    {isFixing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Scan className="h-4 w-4" />
                        Fix Resume
                      </>
                    )}
                  </Button>
                </div>

                {fixedResumeText && (
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          Resume enhanced successfully!
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleDownloadFixed} size="sm" variant="outline" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download JSON
                        </Button>
                        <Button 
                          onClick={handleDownloadFixedPDF} 
                          size="sm" 
                          className="gap-2"
                          disabled={isGeneratingPDF}
                        >
                          {isGeneratingPDF ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              Download PDF
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Hidden resume preview for PDF generation */}
                    <div 
                      id="enhanced-resume-preview" 
                      style={{ 
                        position: 'absolute',
                        left: '-9999px',
                        top: 0,
                        width: '816px'
                      }}
                    >
                      <FaangPathTemplate data={fixedResumeData} />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Enhanced Resume Data:</label>
                      <Textarea 
                        value={fixedResumeText} 
                        readOnly 
                        className="min-h-[250px] font-mono text-xs bg-muted/50"
                      />
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}
      </ScrollArea>

      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
      <input
        ref={reUploadInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => handleFileUpload(e, true)}
      />
    </Card>
  );
};
