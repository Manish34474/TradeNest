export const mailConfig = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

export const mailGenConfig = {
  theme: "default",
  product: {
    name: "Trade Nest",
    link: "https://localhost:3000/",
  },
};
