import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './models';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class ScanTriggerResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field({ nullable: true })
  scanId?: string;
}

@ObjectType()
export class HealthScoreResponse {
  @Field()
  score: number;

  @Field()
  label: string;

  @Field()
  color: string;

  @Field()
  totalFindings: number;

  @Field()
  criticalFindings: number;

  @Field()
  highFindings: number;

  @Field()
  mediumFindings: number;

  @Field()
  lowFindings: number;
}
