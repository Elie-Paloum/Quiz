export interface Historian {
  id: number;
  name: string;
  image: string;
  role: string;
  description: string;
  achievements: string[];
  birthDeath: string;
}

export const historians: Historian[] = [
  {
    id: 1,
    name: "Ada Lovelace",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0b/Ada_Byron_daguerreotype_by_Antoine_Claudet_1843_or_1850.jpg",
    role: "First Computer Programmer",
    description:
      "Ada Lovelace was an English mathematician and writer, chiefly known for her work on Charles Babbage's proposed mechanical general-purpose computer, the Analytical Engine. She was the first to recognize that the machine had applications beyond pure calculation, and published the first algorithm intended to be carried out by such a machine.",
    achievements: [
      "Wrote the first algorithm intended to be processed by a machine",
      "Recognized the potential of computers beyond pure calculation",
      "Published detailed notes on the Analytical Engine",
      "Considered the first computer programmer",
    ],
    birthDeath: "1815-1852",
  },
  {
    id: 2,
    name: "Alan Turing",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/a1/Alan_Turing_Aged_16.jpg",
    role: "Father of Computer Science",
    description:
      "Alan Turing was an English mathematician, computer scientist, logician, cryptanalyst, philosopher, and theoretical biologist. He was highly influential in the development of theoretical computer science, providing a formalisation of the concepts of algorithm and computation with the Turing machine, which can be considered a model of a general-purpose computer.",
    achievements: [
      "Developed the Turing machine concept",
      "Led the team that broke the Enigma code during WWII",
      "Created the Turing Test for artificial intelligence",
      "Made fundamental contributions to computer science theory",
    ],
    birthDeath: "1912-1954",
  },
  {
    id: 3,
    name: "Grace Hopper",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/ad/Commodore_Grace_M._Hopper%2C_USN_%28covered%29.jpg",
    role: "Pioneer of Computer Programming",
    description:
      "Grace Hopper was an American computer scientist and United States Navy rear admiral. One of the first programmers of the Harvard Mark I computer, she was a pioneer of computer programming who invented one of the first linkers. She popularized the idea of machine-independent programming languages, which led to the development of COBOL.",
    achievements: [
      "Developed the first compiler for a computer programming language",
      "Created COBOL, one of the first high-level programming languages",
      "Coined the term 'debugging'",
      "Pioneered the concept of machine-independent programming languages",
    ],
    birthDeath: "1906-1992",
  },
  {
    id: 4,
    name: "Tim Berners-Lee",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/4e/Sir_Tim_Berners-Lee_%28cropped%29.jpg",
    role: "Inventor of the World Wide Web",
    description:
      "Sir Tim Berners-Lee is an English computer scientist best known as the inventor of the World Wide Web. He is a Professorial Fellow of Computer Science at the University of Oxford and a professor at the Massachusetts Institute of Technology. He made the first proposal for the World Wide Web in 1989 while working at CERN.",
    achievements: [
      "Invented the World Wide Web",
      "Created the first web browser and editor",
      "Founded the World Wide Web Consortium (W3C)",
      "Developed the first web server",
    ],
    birthDeath: "1955-Present",
  },
];
