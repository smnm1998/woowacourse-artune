import { createParamDecorator } from '@nestjs/common';

/**
 * 커스텀 Body Decorator (NestJS의 기본 @Body() decorator가 Javascript로는 작동하지 않음)
 *
 * 원인: Babel이 parameter decorator를 지원하지 않음
 *
 * 이 decorator는 createParamDecorator를 사용하여 직접 구현
 * ExecutionContext에서 HTTP request를 가져와서 body를 반환
 *
 * 사용법:
 * @Post('endpoint')
 * async method(@Body() body) {
 *  // body 사용
 * }
 *
 * 특정 필드만 가져오기:
 * async method(@Body('fieldName) field) {
 *  // field 사용
 * }
 */
export const Body = createParamDecorator((data, ctx) => {
  // ExecutionContext에서 HTTP request 객체 가져오기
  const request = ctx.switchToHttp().getRequest();

  // data가 있으면 body의 특정 필드, 없으면 전체 반환
  return data ? request.body[data] : request.body;
});
