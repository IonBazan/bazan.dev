[![GitHub License](https://img.shields.io/github/license/IonBazan/bazan.dev)](LICENSE)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fbazan.dev)](https://bazan.dev)
[![Chromium HSTS preload](https://img.shields.io/hsts/preload/bazan.dev)](https://hstspreload.org/?domain=bazan.dev)
[![GitHub deployments](https://img.shields.io/github/deployments/IonBazan/bazan.dev/Production)](https://github.com/IonBazan/bazan.dev/deployments)
![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/IonBazan/bazan.dev)
[![GitHub last commit](https://img.shields.io/github/last-commit/IonBazan/bazan.dev)](https://github.com/IonBazan/bazan.dev)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/IonBazan/bazan.dev)](https://github.com/IonBazan/bazan.dev)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/IonBazan)](https://github.com/sponsors/IonBazan)

## About

Hi, I'm [Ion Bazan](https://bazan.dev/), a software engineer who loves to build things.
I'm passionate about web technologies and building products that make a positive impact on people's lives.

This repository contains the source code of my personal website, which is built with [Hugo](https://gohugo.io/), automatically deployed to [Vercel](https://vercel.com/) and is available at https://bazan.dev. 

## Features

This website serves as a digital business card and a resume. It includes the following features:

- **Responsive Design**: fully responsive and optimized for various screen sizes.
- **Minimalistic Design**: clean and minimalistic design, focusing on content.
- **Lightweight**: no blocking JavaScript, no cookies, just HTML and CSS.
- **Printable**: optimized for printing (especially the resume), so you can easily generate a PDF version of it.
- **SEO-friendly**: optimized for search engines, with proper meta tags and structured data.

## Technologies and libraries

To ensure the website is simple and lightweight, tools and libraries are limited to:

- **[Hugo](https://gohugo.io/)**: static site generator written in Go.
- **[Bootstrap 5](https://getbootstrap.com/)**: front-end framework.
- **[SCSS](https://sass-lang.com/)**: CSS preprocessor.
- **[Vercel](https://vercel.com/)**: cloud platform for static sites and serverless functions.
- **[FontAwesome](https://fontawesome.com/)**: web icons library.
- **[PostCSS](https://postcss.org/)**: CSS post-processor.

## Development

To run the website locally, you need to have Hugo installed on your machine. You can follow the [official installation guide](https://gohugo.io/getting-started/installing/) to install Hugo.

```bash
npm install
hugo server
```

This will run the website locally at `http://localhost:1313/`.

The content is stored in `content/` and `data/` directories. The layout and styles are stored in `layouts/` and `assets/` directories, respectively.
Some additional information like repository details are automatically fetched from GitHub API at build time.

## Deployment

The website is automatically deployed to [Vercel](https://vercel.com/) when changes are pushed to the `main` branch. 
Other branches and PRs will be automatically deployed to [preview URLs](https://vercel.com/docs/deployments/preview-deployments).

## License

This project is open source and available under the [Apache License 2.0](LICENSE).
