import { Share2, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonsProps {
  ifsc: string;
  bankName: string;
  branchName: string;
  address?: string;
}

export function ShareButtons({ ifsc, bankName, branchName, address }: ShareButtonsProps) {
  const { toast } = useToast();
  
  const shareText = `IFSC Code: ${ifsc}\nBank: ${bankName}\nBranch: ${branchName}${address ? `\nAddress: ${address}` : ''}\n\nFound on IFSC Finder`;
  const shareUrl = `${window.location.origin}/branch/${ifsc}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-600',
      url: `https://wa.me/?text=${encodedText}%0A%0A${encodedUrl}`,
    },
    {
      name: 'Twitter',
      icon: () => (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: 'text-foreground',
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'text-blue-600',
      url: `mailto:?subject=IFSC Code: ${ifsc} - ${bankName}&body=${encodedText}%0A%0A${encodedUrl}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Link Copied!',
        description: 'Share link has been copied to clipboard.',
      });
    } catch {
      toast({
        title: 'Copy Failed',
        description: 'Please copy the link manually.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {shareOptions.map((option) => (
          <DropdownMenuItem
            key={option.name}
            onClick={() => handleShare(option.url)}
            className="cursor-pointer gap-3"
          >
            <option.icon className={`h-4 w-4 ${option.color}`} />
            Share on {option.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer gap-3">
          <Share2 className="h-4 w-4 text-primary" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
