export const emailToFullName = (email) => {
  if (!email) return "";
  //const e = {...email}
  console.log(email[0])
  const [localPart] = email[0].split("@");
  const [first, last] = localPart.split(".");

  if (!first || !last) return email;

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return `${capitalize(first)} ${capitalize(last)}`;
};
