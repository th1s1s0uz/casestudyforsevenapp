/**
 * Utility functions for task-related operations
 */

export interface ParsedTaskName {
  icon: string;
  name: string;
}

export interface ParsedChecklist {
  description: string;
  checklist: string[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

/**
 * Parses task name to extract emoji and clean name
 * @param name - The task name (e.g., "📝 Complete project")
 * @returns Object with icon and clean name
 */
export const parseTaskName = (name: string): ParsedTaskName => {
  const emojiMatch = name.match(/^(\p{Emoji})\s+(.+)$/u);
  if (emojiMatch) {
    return {
      icon: emojiMatch[1],
      name: emojiMatch[2]
    };
  }
  return {
    icon: '📝',
    name: name
  };
};

/**
 * Parses description to extract checklist items (simple version for listing)
 * @param description - The task description
 * @returns Object with clean description and checklist array
 */
export const parseChecklistFromDescription = (description: string | null): ParsedChecklist => {
  if (!description) return { description: '', checklist: [] };
  
  const checklistMatch = description.match(/📋 Checklist:\n((?:• .+\n?)*)/);
  if (!checklistMatch) return { description, checklist: [] };
  
  const checklistText = checklistMatch[1];
  const checklist = checklistText
    .split('\n')
    .filter(line => line.trim().startsWith('•'))
    .map(line => line.replace('• ', '').trim());
  
  const cleanDescription = description.replace(/\n\n📋 Checklist:\n(?:• .+\n?)*/g, '').trim();
  
  return { description: cleanDescription, checklist };
};

/**
 * Parses description to extract detailed checklist items (for task detail page)
 * @param description - The task description
 * @returns Array of checklist items with completion status
 */
export const parseDetailedChecklistFromDescription = (description: string | null): ChecklistItem[] => {
  if (!description) return [];

  // Find ALL checklist matches and use the LAST one (most recent)
  const allChecklistMatches = description.match(/📋 Checklist:\n((?:• .+(?:\n|$))*)/g);
  
  if (!allChecklistMatches || allChecklistMatches.length === 0) {
    return [];
  }

  // Use the last (most recent) checklist
  const lastChecklistMatch = allChecklistMatches[allChecklistMatches.length - 1];
  const checklistText = lastChecklistMatch.replace('📋 Checklist:\n', '');
  
  const items = checklistText
    .split('\n')
    .filter(line => line.trim().startsWith('•'))
    .map((line, index) => {
      const text = line.replace('• ', '').trim();
      // Check if item is marked as completed (starts with ✓ or contains [x])
      const isCompleted = text.startsWith('✓ ') || text.includes('[x]') || text.includes('[X]');
      const cleanText = text.replace(/^✓ /, '').replace(/\[x\]/gi, '').trim();
      
      return {
        id: index.toString(),
        text: cleanText,
        completed: isCompleted
      };
    });

  return items;
};

/**
 * Removes all checklist sections from description
 * @param description - The task description
 * @returns Clean description without checklist sections
 */
export const removeChecklistFromDescription = (description: string | null): string => {
  if (!description) return '';
  return description.replace(/(\n\n)?📋 Checklist:\n(?:• .+(?:\n|$))*/g, '').trim();
};

/**
 * Creates checklist text from checklist items
 * @param items - Array of checklist items
 * @returns Formatted checklist text
 */
export const createChecklistText = (items: ChecklistItem[]): string => {
  return items.map(item => 
    `• ${item.completed ? '✓ ' : ''}${item.text}`
  ).join('\n');
};

/**
 * Creates full description with checklist
 * @param baseDescription - Base description text
 * @param checklistItems - Array of checklist items
 * @returns Full description with checklist section
 */
export const createFullDescription = (baseDescription: string, checklistItems: ChecklistItem[]): string => {
  const checklistText = createChecklistText(checklistItems);
  return baseDescription
    ? `${baseDescription}\n\n📋 Checklist:\n${checklistText}`
    : `📋 Checklist:\n${checklistText}`;
};
