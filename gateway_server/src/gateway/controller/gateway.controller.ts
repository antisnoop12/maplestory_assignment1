import {
  Controller,
  All,
  Req,
  Res,
  UseGuards,
  Post,
  Get,
  Param,
  Body,
  Patch,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Roles } from '../../auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('maple')
export class GatewayController {
  constructor(private readonly httpService: HttpService) {}

  AUTHSERVER = 'http://auth_server:3002';
  EVENTSERVER = 'http://event_server:3003';

  @All('auth/users/*')
  async proxyAuthServer(@Req() req: Request, @Res() res: Response) {
    //const url = `http://localhost:3002${req.url}`; // AuthServer 주소
    const url = `${this.AUTHSERVER}${req.url}`; // AuthServer 주소
    const method = req.method.toLowerCase();
    try {
      const response = await lastValueFrom(
        this.httpService.request({
          url,
          method,
          data: req.body,
        }),
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json(error.response?.data || { message: 'Proxy Error' });
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @All('event/admin/*')
  async proxyEventAdminServer(@Req() req: Request, @Res() res: Response) {
    const url = `${this.EVENTSERVER}${req.url}`;
    const method = req.method.toLowerCase();
    try {
      const response = await lastValueFrom(
        this.httpService.request({
          url,
          method,
          data: req.body,
        }),
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json(error.response?.data || { message: 'Proxy Error' });
    }
  }

  @Get('auth/characters')
  async proxyGetAllCharacters(@Req() req: Request, @Res() res: Response) {
    const url = `${this.AUTHSERVER}${req.url}`;
    try {
      const response = await lastValueFrom(this.httpService.get(url));
      res.status(response.status).json(response.data);
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json(error.response?.data || { message: 'Proxy Error' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('auth/characters')
  async proxyCreateCharacter(@Req() req: any, @Res() res: Response) {
    const userId = req.user.email;
    const { nickname } = req.body;
    const url = `${this.AUTHSERVER}${req.url}`;

    // AuthServer로 보낼 데이터
    const data = { userId, nickname };

    try {
      const response = await lastValueFrom(this.httpService.post(url, data));
      res.status(response.status).json(response.data);
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json(error.response?.data || { message: 'Proxy Error' });
    }
  }

  // 모든 보상 조회
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'AUDITOR')
  @Get('event/reward')
  async proxyGetAllRewardRequests(@Req() req: Request, @Res() res: Response) {
    const url = `${this.EVENTSERVER}/maple/event/reward`;
    try {
      const response = await lastValueFrom(this.httpService.get(url));
      res.status(response.status).json(response.data);
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json(error.response?.data || { message: 'Proxy Error' });
    }
  }

  // 캐릭터 수정
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch('auth/characters/nickname/:nickname')
  async proxyUpdateCharacterByNickname(
    @Param('nickname') nickname: string,
    @Body() body: { level?: number; arcaneForce?: number },
    @Res() res: Response,
  ) {
    const url = `${this.AUTHSERVER}/maple/auth/characters/nickname/${encodeURIComponent(nickname)}`;
    try {
      const response = await lastValueFrom(this.httpService.patch(url, body));
      res.status(response.status).json(response.data);
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json(error.response?.data || { message: 'Proxy Error' });
    }
  }

  // 이벤트 보상 신청
  @UseGuards(AuthGuard('jwt'))
  @Post('event/reward')
  async proxyCreateRewardRequest(@Req() req: any, @Res() res: Response) {
    const email = req.user.email;
    const { nickname, title, subTitle } = req.body;

    const charUrl = `${this.AUTHSERVER}/maple/auth/characters/user/${encodeURIComponent(
      email,
    )}/nickname/${encodeURIComponent(nickname)}`;
    let character;
    try {
      const charResponse = await lastValueFrom(this.httpService.get(charUrl));
      character = charResponse.data;
      if (!character) {
        return res.status(400).json({ message: '해당 유저의 캐릭터가 존재하지 않습니다.' });
      }
    } catch (error) {
      return res.status(400).json({ message: '캐릭터 정보 조회 실패' });
    }

    //  이벤트 정보 조회
    const eventUrl = `${this.EVENTSERVER}/maple/event/admin?title=${encodeURIComponent(
      title,
    )}&subTitle=${encodeURIComponent(subTitle)}`;
    let event;
    try {
      const eventResponse = await lastValueFrom(this.httpService.get(eventUrl));
      event = Array.isArray(eventResponse.data) ? eventResponse.data[0] : eventResponse.data;
      if (!event) {
        return res.status(400).json({ message: '이벤트를 찾을 수 없습니다.' });
      }
    } catch (error) {
      return res.status(400).json({ message: '이벤트 정보 조회 실패' });
    }

    // 이벤트 option에 따라 conditionName, conditionValue 결정
    let conditionName = '';
    let conditionValue: number | undefined;
    if (event.option === 'level') {
      conditionName = 'level';
      conditionValue = character.level;
    } else if (event.option === 'arcaneForce') {
      conditionName = 'arcaneForce';
      conditionValue = character.arcaneForce;
    } else {
      return res.status(400).json({ message: '이벤트 옵션이 올바르지 않습니다.' });
    }

    // Reward 서버로 보상 요청 저장
    const rewardUrl = `${this.EVENTSERVER}/maple/event/reward`;
    const data = { nickname, title, subTitle, conditionName, conditionValue };
    try {
      const response = await lastValueFrom(this.httpService.post(rewardUrl, data));
      res.status(response.status).json(response.data);
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json(error.response?.data || { message: 'Proxy Error' });
    }
  }

  // 보상 조건 확인 후 만족 시 보상 지급
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post('event/reward/check')
  async proxyCheckRewardCondition(@Req() req: Request, @Res() res: Response) {
    const { nickname, title, subTitle } = req.body;

    // Reward 서버에서 해당 보상 신청 찾기
    const rewardUrl = `${this.EVENTSERVER}/maple/event/reward`;
    let reward;
    try {
      const rewardResponse = await lastValueFrom(
        this.httpService.get(
          `${rewardUrl}?nickname=${encodeURIComponent(nickname)}&title=${encodeURIComponent(
            title,
          )}&subTitle=${encodeURIComponent(subTitle)}`,
        ),
      );
      if (Array.isArray(rewardResponse.data)) {
        reward = rewardResponse.data.find(
          (r: any) => r.nickname === nickname && r.title === title && r.subTitle === subTitle,
        );
      } else {
        reward = rewardResponse.data;
        if (
          !reward ||
          reward.nickname !== nickname ||
          reward.title !== title ||
          reward.subTitle !== subTitle
        ) {
          reward = undefined;
        }
      }
      if (!reward) {
        return res.status(404).json({ message: '보상 신청을 찾을 수 없습니다.' });
      }
    } catch (error) {
      return res.status(400).json({ message: '보상 신청 조회 실패' });
    }

    // Event 서버에서 해당 이벤트 정보 찾기
    const eventUrl = `${this.EVENTSERVER}/maple/event/admin?title=${encodeURIComponent(
      title,
    )}&subTitle=${encodeURIComponent(subTitle)}`;
    let event;
    try {
      const eventResponse = await lastValueFrom(this.httpService.get(eventUrl));
      event = Array.isArray(eventResponse.data) ? eventResponse.data[0] : eventResponse.data;
      if (!event) {
        return res.status(404).json({ message: '이벤트를 찾을 수 없습니다.' });
      }
    } catch (error) {
      return res.status(400).json({ message: '이벤트 정보 조회 실패' });
    }

    // 조건 비교
    const destination = Number(event.destination);
    const conditionValue = Number(reward.conditionValue);

    if (isNaN(destination) || isNaN(conditionValue)) {
      return res.status(400).json({ message: '조건 값이 올바르지 않습니다.' });
    }

    // 조건 만족 시 rewarded 업데이트
    if (conditionValue >= destination) {
      try {
        const patchUrl = `${this.EVENTSERVER}/maple/event/reward/${reward._id}`;
        const patchResponse = await lastValueFrom(
          this.httpService.patch(patchUrl, { rewarded: true }),
        );
        return res.status(200).json({
          message: '보상 조건을 만족하여 수령 처리되었습니다.',
          reward: patchResponse.data,
        });
      } catch (error) {
        return res.status(500).json({ message: '보상 상태 업데이트 실패' });
      }
    } else {
      return res.status(200).json({ message: '조건을 만족하지 못했습니다.', reward });
    }
  }

  // 유저 내 보상 신청 목록 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('event/reward/my')
  async proxyGetMyRewardRequests(@Req() req: any, @Res() res: Response) {
    const email = req.user.email;

    // 캐릭터 서버에서 내 캐릭터 목록 조회
    const charUrl = `${this.AUTHSERVER}/maple/auth/characters/userId/${encodeURIComponent(email)}`;
    let characters;
    try {
      const charResponse = await lastValueFrom(this.httpService.get(charUrl));
      characters = charResponse.data;
      if (!Array.isArray(characters) || characters.length === 0) {
        return res.status(200).json([]);
      }
    } catch (error) {
      return res.status(400).json({ message: '캐릭터 정보 조회 실패' });
    }

    // 캐릭터 닉네임 목록 추출
    const nicknames = characters.map((c: any) => c.nickname);
    console.log(nicknames);
    const rewardUrl = `${this.EVENTSERVER}/maple/event/reward/nickname`;
    try {
      console.log('te');
      const query = nicknames.map(n => `nickname=${encodeURIComponent(n)}`).join('&');
      console.log(query);
      const rewardsResponse = await lastValueFrom(this.httpService.get(`${rewardUrl}?${query}`));
      console.log(rewardsResponse);
      res.status(rewardsResponse.status).json(rewardsResponse.data);
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json(error.response?.data || { message: '보상 목록 조회 실패' });
    }
  }
}
