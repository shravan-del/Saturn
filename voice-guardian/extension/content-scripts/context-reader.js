/**
 * Context Reader
 * Extracts context from web pages
 */

const ContextReader = {
  /**
   * Get page context based on URL
   */
  getPageContext() {
    const url = window.location.href;
    const context = {
      url: url,
      title: document.title,
      page_type: this.detectPageType(url),
      timestamp: new Date().toISOString()
    };

    // Add page-specific context
    if (context.page_type === 'gmail') {
      context.gmail = this.getGmailContext();
    } else if (context.page_type === 'calendar') {
      context.calendar = this.getCalendarContext();
    } else if (context.page_type === 'docs') {
      context.docs = this.getDocsContext();
    }

    return context;
  },

  /**
   * Detect page type
   */
  detectPageType(url) {
    if (url.includes('mail.google.com')) return 'gmail';
    if (url.includes('calendar.google.com')) return 'calendar';
    if (url.includes('docs.google.com')) return 'docs';
    return 'unknown';
  },

  /**
   * Get Gmail-specific context
   */
  getGmailContext() {
    try {
      // Check if composing email
      const composeBox = document.querySelector('[aria-label="Subject"]');
      if (composeBox) {
        return {
          mode: 'compose',
          subject: composeBox.value || ''
        };
      }

      // Check if viewing email
      const emailSubject = document.querySelector('h2[data-legacy-thread-id]');
      if (emailSubject) {
        return {
          mode: 'view',
          subject: emailSubject.textContent
        };
      }

      return { mode: 'inbox' };
    } catch (error) {
      console.error('Gmail context error:', error);
      return {};
    }
  },

  /**
   * Get Calendar-specific context
   */
  getCalendarContext() {
    try {
      // Get currently selected date
      const selectedDate = document.querySelector('[data-datekey]');
      if (selectedDate) {
        return {
          selected_date: selectedDate.getAttribute('data-datekey')
        };
      }

      return {};
    } catch (error) {
      console.error('Calendar context error:', error);
      return {};
    }
  },

  /**
   * Get Docs-specific context
   */
  getDocsContext() {
    try {
      // Get document title
      const titleElement = document.querySelector('.docs-title-input');
      if (titleElement) {
        return {
          document_title: titleElement.textContent,
          document_id: this.extractDocId(window.location.href)
        };
      }

      return {};
    } catch (error) {
      console.error('Docs context error:', error);
      return {};
    }
  },

  /**
   * Extract document ID from URL
   */
  extractDocId(url) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  }
};

// Listen for context requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'get-page-context') {
    const context = ContextReader.getPageContext();
    sendResponse(context);
  }
  return false;
});

// Export for other scripts
if (typeof window !== 'undefined') {
  window.ContextReader = ContextReader;
}


