import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IFSCData } from '@/lib/csvParser';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface PDFDownloadButtonProps {
  branch: IFSCData;
  variant?: 'default' | 'icon';
}

export function PDFDownloadButton({ branch, variant = 'default' }: PDFDownloadButtonProps) {
  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Colors
      const primaryColor: [number, number, number] = [59, 130, 246]; // Blue
      const textColor: [number, number, number] = [31, 41, 55];
      const mutedColor: [number, number, number] = [107, 114, 128];
      
      // Header with gradient-like effect
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('IFSC Code Details', 20, 25);
      
      // Subtitle
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Bank Branch Information', 20, 35);
      
      // IFSC Code highlight box
      doc.setFillColor(240, 249, 255);
      doc.roundedRect(15, 55, pageWidth - 30, 30, 3, 3, 'F');
      doc.setDrawColor(...primaryColor);
      doc.roundedRect(15, 55, pageWidth - 30, 30, 3, 3, 'S');
      
      doc.setTextColor(...mutedColor);
      doc.setFontSize(10);
      doc.text('IFSC Code', 25, 65);
      
      doc.setTextColor(...primaryColor);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(branch.IFSC, 25, 78);
      
      // Branch details section
      let yPos = 100;
      const lineHeight = 12;
      const labelX = 25;
      const valueX = 80;
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textColor);
      doc.setFontSize(14);
      doc.text('Branch Details', labelX, yPos);
      yPos += 15;
      
      // Divider line
      doc.setDrawColor(229, 231, 235);
      doc.line(labelX, yPos - 5, pageWidth - 25, yPos - 5);
      
      const details = [
        { label: 'Bank Name', value: branch.Bank },
        { label: 'Branch Name', value: branch.Branch },
        { label: 'MICR Code', value: branch.MICR || 'N/A' },
        { label: 'Address', value: branch.Address },
        { label: 'City', value: branch.City },
        { label: 'District', value: branch.District },
        { label: 'State', value: branch.State },
        { label: 'Contact', value: branch.Contact || 'N/A' },
      ];
      
      details.forEach((item) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...mutedColor);
        doc.text(item.label, labelX, yPos);
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...textColor);
        
        // Handle long text wrapping
        const maxWidth = pageWidth - valueX - 25;
        const splitText = doc.splitTextToSize(item.value, maxWidth);
        doc.text(splitText, valueX, yPos);
        
        yPos += lineHeight * (splitText.length || 1);
      });
      
      // Services section
      yPos += 10;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textColor);
      doc.setFontSize(14);
      doc.text('Available Services', labelX, yPos);
      yPos += 15;
      
      doc.setDrawColor(229, 231, 235);
      doc.line(labelX, yPos - 5, pageWidth - 25, yPos - 5);
      
      const services = [
        { name: 'NEFT', available: branch.NEFT === 'true' },
        { name: 'RTGS', available: branch.RTGS === 'true' },
        { name: 'IMPS', available: branch.IMPS === 'true' },
        { name: 'UPI', available: branch.UPI === 'true' },
      ];
      
      let xPos = labelX;
      services.forEach((service) => {
        if (service.available) {
          doc.setFillColor(220, 252, 231); // Light green
          doc.setDrawColor(34, 197, 94); // Green
        } else {
          doc.setFillColor(254, 226, 226); // Light red
          doc.setDrawColor(239, 68, 68); // Red
        }
        
        doc.roundedRect(xPos, yPos - 5, 35, 12, 2, 2, 'FD');
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        const textColorRGB = service.available ? [22, 163, 74] : [220, 38, 38];
        doc.setTextColor(textColorRGB[0], textColorRGB[1], textColorRGB[2]);
        doc.text(`${service.name}: ${service.available ? '✓' : '✗'}`, xPos + 3, yPos + 2);
        
        xPos += 42;
      });
      
      // Footer
      yPos = doc.internal.pageSize.getHeight() - 30;
      doc.setDrawColor(229, 231, 235);
      doc.line(25, yPos, pageWidth - 25, yPos);
      
      yPos += 10;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...mutedColor);
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, labelX, yPos);
      
      doc.text('IFSC Finder - Developed by Pawan Yadav', pageWidth - 25, yPos, { align: 'right' });
      
      // Save the PDF
      doc.save(`IFSC_${branch.IFSC}.pdf`);
      
      toast({
        title: 'PDF Downloaded!',
        description: `Branch details saved as IFSC_${branch.IFSC}.pdf`,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: 'Download Failed',
        description: 'Unable to generate PDF. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={generatePDF}
        className="h-9 w-9 rounded-full border-primary/30 hover:bg-primary/10 hover:text-primary"
      >
        <Download className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={generatePDF}
      className="gap-2 border-primary/30 hover:bg-primary/10 hover:text-primary"
    >
      <FileText className="h-4 w-4" />
      Download PDF
    </Button>
  );
}
