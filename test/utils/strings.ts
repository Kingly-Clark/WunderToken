export const accessControlMessage = (role: string, account: string) =>
  `AccessControl: account ${account.toLowerCase()} is missing role ${role.toLowerCase()}`
