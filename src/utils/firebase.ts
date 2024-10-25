import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  serverTimestamp,
  runTransaction,
  getDoc,
} from "firebase/firestore";
import type { Topic, Answer, TopicWord } from "../types/firebase";
import { generateHiragana, generateTopicTitle } from "./topic";
import { updateDoc } from "firebase/firestore";

export const getCurrentTopic = async (
  attempt: number = 0
): Promise<Topic | null> => {
  if (attempt > 5) {
    console.error("最大再帰回数に達しました");
    return null;
  }

  try {
    // 既存のトピックを検索
    const topicsRef = collection(db, "topics");
    const q = query(
      topicsRef,
      where("status", "==", "open"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const topicSnapshot = await getDocs(q);

    if (!topicSnapshot.empty) {
      const topicDoc = topicSnapshot.docs[0];
      return {
        id: topicDoc.id, // FirestoreのドキュメントIDを使用
        ...topicDoc.data(),
      } as Topic;
    }

    // 新しいトピックを生成
    const phrasesRef = collection(db, "topicPhrases");
    const phraseQuery = query(
      phrasesRef,
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const phraseSnapshot = await getDocs(phraseQuery);

    if (phraseSnapshot.empty) {
      console.warn("お題フレーズが見つかりませんでした。");
      return null;
    }

    const phraseDoc = phraseSnapshot.docs[0];
    const topicPhrase = phraseDoc.data().phrase;

    const newTopic = {
      title: generateTopicTitle(generateHiragana(), topicPhrase),
      hiragana: generateHiragana(),
      topicPhrase: topicPhrase,
      status: "open",
      createdAt: serverTimestamp(), // 一貫性のためserverTimestampを使用
      correctAnswerId: null,
      correctAnswer: null,
    };

    const docRef = await addDoc(collection(db, "topics"), newTopic);
    await updateDoc(docRef, { id: docRef.id });

    return {
      ...newTopic,
      id: docRef.id,
      status: "open" as "open" | "closed",
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error in getCurrentTopic:", error);
    throw error;
  }
};

export const submitAnswer = async (
  topicId: string,
  content: string
): Promise<void> => {
  const answersRef = collection(db, `topics/${topicId}/answers`);
  await addDoc(answersRef, {
    content,
    createdAt: serverTimestamp(),
    approvalCount: 0,
    approvedBy: [],
    isCorrectAnswer: false,
  });
};

export const getAnswers = async (
  topicId: string,
  page: number = 1
): Promise<Answer[]> => {
  const answersRef = collection(db, `topics/${topicId}/answers`);
  const q = query(answersRef, orderBy("createdAt", "desc"), limit(10));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as unknown as Answer)
  );
};

import { useRouter } from "next/router"; // 追加

export const approveAnswer = async (
  topicId: string,
  answerId: string,
  userId: string,
  router: ReturnType<typeof useRouter> // routerを引数として受け取る
): Promise<void> => {
  try {
    await runTransaction(db, async (transaction) => {
      const topicRef = doc(db, "topics", topicId);
      const answerRef = doc(db, `topics/${topicId}/answers/${answerId}`);

      const answerDoc = await transaction.get(answerRef);
      const topicDoc = await transaction.get(topicRef);

      if (!topicDoc.exists()) {
        console.error(`Topic not found with ID: ${topicId}`);
        throw new Error(`お題が見つかりません（ID: ${topicId}）`);
      }

      if (!answerDoc.exists()) {
        console.error(`Answer not found with ID: ${answerId}`);
        throw new Error(`回答が見つかりません（ID: ${answerId}）`);
      }

      const answer = answerDoc.data() as Answer;
      const topic = topicDoc.data() as Topic;

      if (topic.status === "closed") {
        throw new Error("このお題は既に終了しています");
      }

      // 即座にお題をクローズし、正解として設定
      transaction.update(topicRef, {
        status: "closed",
        correctAnswerId: answerId,
        correctAnswer: answer.content,
      });

      transaction.update(answerRef, {
        isCorrectAnswer: true,
        approvalCount: 1,
        approvedBy: [userId],
      });

      // 新しいお題を自動生成
      await generateNewTopic();
    });

    // リダイレクトを追加
    router.push("/"); // トップページにリダイレクト
  } catch (error) {
    console.error("Error in approveAnswer:", error);
    throw error;
  }
};

// 新しいお題を自動生成する関数
const generateNewTopic = async (): Promise<void> => {
  try {
    const phrasesRef = collection(db, "topicPhrases");
    const q = query(phrasesRef, orderBy("createdAt", "desc"), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error("お題フレーズが登録されていません");
    }

    const phraseDoc = snapshot.docs[0];
    const topicPhrase = phraseDoc.data().phrase;

    // 一時的にidを設定せずにトピックを作成
    const newTopic = {
      title: generateTopicTitle(generateHiragana(), topicPhrase),
      hiragana: generateHiragana(),
      topicPhrase: topicPhrase,
      status: "open",
      createdAt: serverTimestamp(), // 一貫性のためserverTimestampを使用
      correctAnswerId: null,
      correctAnswer: null,
    };

    // 新しいドキュメントを追加し、docRefを取得
    const docRef = await addDoc(collection(db, "topics"), newTopic);

    // ドキュメント内のidフィールドを更新してdocRef.idと一致させる
    await updateDoc(docRef, { id: docRef.id });
  } catch (error) {
    console.error("Error in generateNewTopic:", error);
    throw error;
  }
};

export const getClosedTopics = async (): Promise<Topic[]> => {
  try {
    const topicsRef = collection(db, "topics");
    const q = query(
      topicsRef,
      where("status", "==", "closed"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Topic[];
  } catch (error) {
    console.error("Error in getClosedTopics:", error);
    throw error;
  }
};

export const submitTopicPhrase = async (phrase: string): Promise<void> => {
  try {
    const phrasesRef = collection(db, "topicPhrases");
    await addDoc(phrasesRef, {
      phrase,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error in submitTopicPhrase:", error);
    throw error;
  }
};

export const getTopic = async (topicId: string): Promise<Topic | null> => {
  try {
    const topicRef = doc(db, "topics", topicId);
    const topicDoc = await getDoc(topicRef);

    if (topicDoc.exists()) {
      return {
        id: topicDoc.id,
        ...topicDoc.data(),
      } as Topic;
    } else {
      console.warn(`お題が見つかりません（ID: ${topicId}）`);
      return null;
    }
  } catch (error) {
    console.error("Error in getTopic:", error);
    throw error;
  }
};
