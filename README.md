# Chatea con un PDF

## 🚀 Contribuir
1. Crea un [Fork](https://github.com/glaboryp/pdf-chat/fork) del proyecto

2. Clona el repositorio en tu máquina local:
    ```bash
    git clone git@github.com:tu_username/pdf-chat.git
    ```

3. Usa la versión de Node indicada en `.nvmrc` (si usas [nvm](https://github.com/nvm-sh/nvm), ejecuta `nvm use`)

4. Copia `.env.example` a `.env` y rellena tus propias credenciales de [Cloudinary](https://cloudinary.com/) y de la [API de OpenAI](https://platform.openai.com/):
    ```bash
    cp .env.example .env
    ```

    En `OPENAI_MODEL` indica el modelo de OpenAI que quieres usar (por ejemplo `gpt-5.4-mini`). Consulta los [modelos disponibles](https://platform.openai.com/docs/models) y sus [precios](https://openai.com/api/pricing/), y evita los que tengan fecha de retirada próxima: OpenAI retira los modelos antiguos y, cuando eso ocurre, las preguntas al PDF dejan de funcionar.

5. Instala las dependencias y ejecuta la aplicación en local
    ```bash
    pnpm install
    pnpm run dev
    ```

6. Realiza los cambios y crea una pull request 🚀


## 🛠️ Stack
- [**Astro**](https://astro.build/) - The web framework for content-driven websites
- [**Svelte**](https://svelte.dev/) - Cybernetically enhanced web apps
- [**Tailwindcss**](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom designs.
- [**ESLint**](https://eslint.org/) - Find and fix problems in your JavaScript code