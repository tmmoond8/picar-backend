import express from 'express';
import EmotionRepository from '../../../repository/EmotionRepository';
import Emotion, { createEmotion } from '../../../entity/Emotion';
import ArticleRepository from '../../../repository/ArticleRepository';
import UserRepository from '../../../repository/UserRepository';

const EMOTION_TYPE = {
  LOVE: 'LOVE',
  SAD: 'SAD',
  LAUGHING: 'LAUGHING',
  ANGRY: 'ANGRY'
} as const;

type EmotionKey = keyof typeof EMOTION_TYPE;

class EmotionController {

  public get = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const {
      params: { articleId },
      body: { user },
    } = req;
    try {
      const emotions = await EmotionRepository().get(articleId);
      const { emotionCount, yourEmotion}  = getEmotionCounter(emotions, user?.profile?.id);
      return res.json({ ok: true, message: 'list', emotionCount, yourEmotion, });
    } catch (error) {
      next(error);
    }
    return res.status(500);
  };

  public getUserEmotions = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const {
      params: { userCode },
      body: { user },
    } = req;
    try {
      let userId = user?.profile.id;
      let targetUserCode = user?.profile.code;
      if (userCode) {
        const targetUser = await UserRepository().getByCode(userCode);
        userId = targetUser?.id;
        targetUserCode = userCode;
      }
      const emotions = await EmotionRepository().list(userId);
      return res.json({ 
        ok: true, 
        message: 'getUserEmotions', 
        emotions: emotions.map(
          ({ id, articleId, type}) => ({ id, articleId, type, userCode: targetUserCode })
        ) 
      });
    } catch (error) {
      next(error);
    }
    return res.status(500);
  };

  public cud = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { body: {
      articleId,
      type,
      user
    }} = req;

    try {
      const emotionListPromise = EmotionRepository().list(articleId);
      const existed = await EmotionRepository().cud({
        articleId: articleId,
        authorId: user.profile.id,
      });
      let updateStatus = '';
      const emotions = await emotionListPromise;
      let { emotionCount, yourEmotion}  = getEmotionCounter(emotions, user.profile.id);
      
      if (existed) {
        if (existed.type === type) {
          await EmotionRepository().remove(existed);
          await ArticleRepository().decreaseEmotion(articleId);
          updateStatus = 'removed';
          yourEmotion = null;
        } else {
          await EmotionRepository().save(existed);
          updateStatus = 'updated';
          emotionCount[type as EmotionKey] = emotionCount[type as EmotionKey] + 1;
          existed.type = type;
          yourEmotion = type;
        }
      } else {
        const newEmotion = createEmotion({
          articleId,
          type,
          authorId: user.profile.id});
        await EmotionRepository().save(newEmotion);
        await ArticleRepository().increaseEmotion(articleId);
        updateStatus = 'created';
        emotionCount[type as EmotionKey] = emotionCount[type as EmotionKey] + 1;
        yourEmotion = type;
      }

      return res.json({ ok: true, message: `emotion ${updateStatus}`, updateStatus, emotionCount, yourEmotion });
    } catch (error) {
      next(error);
    }
    return res.status(500);
  };

}

const getEmotionCounter = (emotions: Emotion[], userId?: string) => {
  const emotionCount = {
    [EMOTION_TYPE.LOVE]: 0,
    [EMOTION_TYPE.SAD]: 0,
    [EMOTION_TYPE.LAUGHING]: 0,
    [EMOTION_TYPE.ANGRY]: 0,
  }
  let yourEmotion = null;
  emotions.reduce((accum, emotion) => {
    if (emotion.type in accum) {
      accum[emotion.type as keyof typeof EMOTION_TYPE] = accum[emotion.type  as keyof typeof EMOTION_TYPE] + 1;
    }
    if (emotion.authorId === userId) {
      yourEmotion = emotion.type;
    }
    return accum;
  }, emotionCount);
  return {
    emotionCount,
    yourEmotion,
  }
}

export default new EmotionController();
