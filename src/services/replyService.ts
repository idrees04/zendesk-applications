import { TicketData, CustomerProfile, CustomerPost } from '../types/zendesk';

export type ReplyTone = 'friendly' | 'concise';

class ReplyService {
  generateReply(
    ticketData: TicketData,
    customerProfile: CustomerProfile | null,
    posts: CustomerPost[],
    tone: ReplyTone = 'friendly'
  ): string {
    const templates = {
      friendly: this.getFriendlyTemplate(),
      concise: this.getConciseTemplate()
    };

    const template = templates[tone];
    
    // Extract customer info
    const customerName = customerProfile?.name || 'Customer';
    const customerCompany = customerProfile?.company?.name || '';
    const customerCity = customerProfile?.address?.city || '';
    const customerWebsite = customerProfile?.website || '';

    // Generate context from posts
    const recentActivity = posts.length > 0 
      ? `I see you've been active with topics like "${posts[0]?.title}" recently.`
      : '';

    // Clean and truncate subject and description
    const subject = this.cleanText(ticketData.subject);
    const description = this.truncateText(this.cleanText(ticketData.description), 100);

    // Replace template variables
    return template
      .replace('{customerName}', customerName)
      .replace('{subject}', subject)
      .replace('{description}', description)
      .replace('{companyInfo}', customerCompany ? ` from ${customerCompany}` : '')
      .replace('{locationInfo}', customerCity ? ` in ${customerCity}` : '')
      .replace('{recentActivity}', recentActivity)
      .replace('{websiteInfo}', customerWebsite ? `\n\nI noticed your website (${customerWebsite}) - thanks for sharing that with us.` : '')
      .trim();
  }

  private getFriendlyTemplate(): string {
    return `Hi {customerName},

Thank you for reaching out{companyInfo}{locationInfo}! I've received your inquiry about "{subject}" and I'm here to help.

{recentActivity}

Regarding your message: "{description}"

I understand your concern and I'm committed to providing you with the best possible solution. Let me look into this matter and get back to you with a comprehensive response shortly.

{websiteInfo}

Please don't hesitate to reach out if you have any additional questions in the meantime.

Best regards,
Customer Support Team`;
  }

  private getConciseTemplate(): string {
    return `Hi {customerName},

Thanks for contacting us about "{subject}".

{recentActivity}

I've reviewed your message: "{description}"

I'll investigate this and provide a solution shortly.{websiteInfo}

Best regards,
Support Team`;
  }

  private cleanText(text: string): string {
    if (!text) return '';
    
    // Remove HTML tags
    const cleanedText = text.replace(/<[^>]*>/g, '');
    
    // Remove extra whitespace
    return cleanedText.replace(/\s+/g, ' ').trim();
  }

  private truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }
}

export const replyService = new ReplyService();