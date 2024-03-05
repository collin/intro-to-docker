export const smallfs = {
  name: "home",
  type: "directory",
  children: [
    {
      name: "docs",
      type: "directory",
      children: [],
    },
    {
      name: "recipes",
      type: "directory",
      children: [],
    },
  ],
};

export const nestedfs = {
  name: "home",
  type: "directory",
  children: [
    {
      name: "docs",
      type: "directory",
      children: [
        {
          name: "tutorials",
          type: "directory",
          children: [
            {
              name: "docker",
              type: "directory",
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

export const bigfs = {
  name: "home",
  type: "directory",
  children: [
    {
      name: "docs",
      type: "directory",
      children: [
        { name: "science.md", type: "file" },
        { name: "history.md", type: "file" },
      ],
    },
    {
      name: "recipes",
      type: "directory",
      children: [
        {
          name: "hot",
          type: "directory",
          children: [
            { name: "pizza.txt", type: "file" },
            { name: "soup.txt", type: "file" },
          ],
        },
        {
          name: "cold",
          type: "directory",
          children: [
            { name: "salad.txt", type: "file" },
            { name: "icecream.txt", type: "file" },
          ],
        },
      ],
    },
    { type: "file", name: "about.txt" },
  ],
};
