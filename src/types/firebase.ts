export interface Topic {
  id: string;
  title: string;
  hiragana: string;
  topicPhrase: string;
  status: "open" | "closed";
  createdAt: Date;
  correctAnswerId: string | null;
  correctAnswer: string | null;
}

export interface Answer {
  id: string;
  content: string;
  createdAt: Date;
  approvalCount: number;
  approvedBy: string[];
  isCorrectAnswer: boolean;
}

export interface TopicWord {
  topicPhrase: string;
  createdAt: Date;
}
