// eslint-disable-next-line node/no-missing-import
import { wunderToEth } from "./conversions"
const initialBalanceEth = "1000"
export const initialBalance = wunderToEth(initialBalanceEth)
