import React from "react";

const Footer = () => {
  const copyright = `Full-situation was made with React | Copyright 2020-${new Date().getFullYear()}`;
  return <div>{copyright}</div>;
};

export default Footer;
