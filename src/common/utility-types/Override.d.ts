export type Override<Original, Override> = Pick<
  Original,
  Exclude<keyof Original, keyof Override>
> &
  Override
