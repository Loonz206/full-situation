import React from "react";

const Header = () => {
  const list = [
    {
      id: 0,
      item: "thing",
      title: "Google",
      link: "https://google.com",
    },
    {
      id: 1,
      item: "thing",
      title: "Amazon",
      link: "https://amazon.com",
    },
    {
      id: 2,
      item: "thing",
      title: "Microsoft",
      link: "https://microsoft.com",
    },
    {
      id: 3,
      item: "thing",
      title: "Cnn",
      link: "https://cnn.com",
    },
  ];
  const renderList = list.map(({ id, link, title }) => {
    return (
      <li key={id}>
        <a href={link} alt={link}>
          {title}
        </a>
      </li>
    );
  });
  return <ul>{renderList}</ul>;
};

export default Header;
