<h1 align="center">
  <sup>react-hook-action</sup>
  <br>
  <a href="https://github.com/shahradelahi/react-hook-action/actions/workflows/ci.yml"><img src="https://github.com/shahradelahi/react-hook-action/actions/workflows/ci.yml/badge.svg?branch=main&event=push" alt="CI"></a>
  <a href="https://www.npmjs.com/package/react-hook-action"><img src="https://img.shields.io/npm/v/react-hook-action.svg" alt="NPM Version"></a>
  <a href="/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat" alt="MIT License"></a>
  <a href="https://bundlephobia.com/package/react-hook-action"><img src="https://img.shields.io/bundlephobia/minzip/react-hook-action" alt="npm bundle size"></a>
  <a href="https://packagephobia.com/result?p=react-hook-action"><img src="https://packagephobia.com/badge?p=react-hook-action" alt="Install Size"></a>
</h1>

_react-hook-action_ is a lightweight React hook for managing asynchronous actions and their loading states, safely resolving promises and globally persisting states using Zustand.

---

- [Installation](#-installation)
- [Usage](#-usage)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#license)

## 📦 Installation

```bash
npm install react-hook-action
```

<details>
<summary>Install using your favorite package manager</summary>

**pnpm**

```bash
pnpm install react-hook-action
```

**yarn**

```bash
yarn add react-hook-action
```

</details>

## 📖 Usage

### Basic Usage

Wrap any asynchronous function to automatically manage `isLoading`, `result`, and `error` states.

```tsx
import { useAction } from 'react-hook-action';

export default function Page() {
  const { result, error, isLoading, dispatch, reset } = useAction(
    'fetchUser',
    async (id: number) => {
      const response = await fetch(`https://api.example.com/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {result && <div>User: {result.name}</div>}
      <button onClick={() => dispatch(1)}>Fetch User</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Initial Result

You can provide an initial result to bypass loading states when data is already available.

```ts
const { result, dispatch } = useAction('fetchSettings', fetchSettingsFn, {
  initialResult: { theme: 'dark', notifications: true },
});
```

### Ignoring Errors

If you want to silently fail and ignore any errors thrown by the action, use `ignoreErrors`. This will prevent the `error` state from being updated.

```ts
const { dispatch } = useAction('analyticsPing', sendAnalytics, {
  ignoreErrors: true,
});
```

### Error Callbacks

Easily handle side-effects cleanly with the `onError` callback when an action fails.

```ts
const { dispatch } = useAction('saveData', saveDataFn, {
  onError: (error) => {
    toast.error(`Save failed: ${error.message}`);
  },
});
```

## 📚 Documentation

For all configuration options, please see [the API docs](https://www.jsdocs.io/package/react-hook-action).

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/react-hook-action).

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi) and [contributors](https://github.com/shahradelahi/react-hook-action/graphs/contributors).
