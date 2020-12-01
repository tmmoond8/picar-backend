import express from 'express';
import EmotionRepository from '../../../repository/EmotionRepository';
import { createEmotion } from '../../../entity/Emotion';

const EMOTION_TYPE = {
  LOVE: 'LOVE',
  SAD: 'SAD',
  LAUGHING: 'LAUGHING',
  ANGRY: 'ANGRY'
} as const;

class EmotionController {
  public list = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const {
      params: { articleId },
      body: { user: { profile} },
    } = req;
    const emotionCount = {
      [EMOTION_TYPE.LOVE]: 0,
      [EMOTION_TYPE.SAD]: 0,
      [EMOTION_TYPE.LAUGHING]: 0,
      [EMOTION_TYPE.ANGRY]: 0,
    }
    try {
      const emotions = await EmotionRepository().list(articleId);
      let yourEmotion = '';
      emotions.reduce((accum, emotion) => {
        if (emotion.type in accum) {
          accum[emotion.type as keyof typeof EMOTION_TYPE] = accum[emotion.type  as keyof typeof EMOTION_TYPE] + 1;
        }
        if (emotion.authorId === profile.id) {
          yourEmotion = emotion.type;
        }
        return accum;
      }, emotionCount);
      res.json({ ok: true, message: 'list', emotions: {
        emotionCount,
        yourEmotion,
      },  });
    } catch (error) {
      next(error);
    }
  };

  public cud = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { body } = req;
    try {
      const existed = await EmotionRepository().cud({
        articleId: body.articleId,
        authorId: '0f13e37e-0849-42b5-8d70-b44a4499335e',
      });
      let work = '';

      if (existed) {
        if (existed.type === body.type) {
          await EmotionRepository().remove(existed);
          work = 'removed';
        } else {
          existed.type = body.type;
          await EmotionRepository().save(existed);
          work = 'updated';
        }
      } else {
        const newEmotion = createEmotion(body);
        EmotionRepository().save(newEmotion);
        work = 'created';
      }

      res.json({ ok: true, message: `emotion ${work}` });
    } catch (error) {
      next(error);
    }
  };
}

export default new EmotionController();
