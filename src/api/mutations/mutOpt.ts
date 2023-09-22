import { UseMutationOptions } from '@tanstack/react-query'

export type MutOpt<Response, TVariables = unknown> = UseMutationOptions<
  Response,
  TVariables,
  TVariables,
  unknown
>
