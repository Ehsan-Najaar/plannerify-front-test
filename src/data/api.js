const HOST = process.env.NEXT_PUBLIC_API_URL

export const LOGIN = `${HOST}/auth/login`
export const LOGOUT = `${HOST}/auth/logout`
export const ME = `${HOST}/auth/me`
export const USER = `${HOST}/user`
export const GET_CODE_FOR_EMAIL = `${HOST}/user/getCodeForEmail`
export const PASSWORD_RECOVERY = `${HOST}/auth/password-recovery`

export const TASK = `${HOST}/task`
export const TASK_BY_DATE = `${HOST}/task/by-date`
export const TASK_DONE_TOGGLE = `${HOST}/task`

export const SCHEDULE = `${HOST}/schedule`

export const GOAL = `${HOST}/goal`
export const IDEA = `${HOST}/idea`

export const PLAN = `${HOST}/plan`
export const PLAN_SETTINGS = `${HOST}/plan/settings`

export const SURVEY = `${HOST}/surveys`
export const REPORT = `${HOST}/reports`
export const LANGUAGE = `${HOST}/languages`

export const CONTENT = `${HOST}/contents`
export const SUBSCRIPTIONS = `${HOST}/subscriptions`

export const OVERVIEW = `${HOST}/overview`

export const PAYPAL_ORDER = `${HOST}/paypal/order`
export const PAYPAL_FINALIZE_ORDER = `${HOST}/paypal/finalize-order`
export const PAYPAL_CHART = `${HOST}/paypal/chart`

export const SOCIAL = `${HOST}/socials`
export const ABOUT = `${HOST}/about`
export const TERMS = `${HOST}/terms`
