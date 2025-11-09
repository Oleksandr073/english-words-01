import reactLogo from '../assets/react.svg';
import viteLogo from '../assets/vite.svg';
import { counterModel } from '../redux/counter';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export const HomePage = () => {
  const dispatch = useAppDispatch();

  const value = useAppSelector(counterModel.selectors.selectValue);

  const increment = (): void => {
    dispatch(counterModel.actions.increment());
  };

  const decrement = (): void => {
    dispatch(counterModel.actions.decrement());
  };

  const incrementAsync = (): void => {
    dispatch(counterModel.actions.incrementAsync());
  };

  const decrementAsync = (): void => {
    dispatch(counterModel.actions.decrementAsync());
  };

  return (
    <div>
      <div className="flex justify-center">
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <div>
          <button onClick={incrementAsync} className="button">
            Increment after 1 second
          </button>{' '}
          <button onClick={decrementAsync} className="button">
            Decrement after 1 second
          </button>{' '}
          <button onClick={increment} className="button">
            + Increment
          </button>{' '}
          <button onClick={decrement} className="button">
            - Decrement
          </button>
          <hr />
          <div>Clicked: {value} times</div>
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
};
