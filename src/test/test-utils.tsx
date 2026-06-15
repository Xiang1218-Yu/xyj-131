import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { act } from '@testing-library/react';
import { describe, beforeEach } from 'vitest';

interface TestRouterProps {
  children: React.ReactNode;
  initialEntries?: string[];
}

export function TestRouter({ children, initialEntries = ['/'] }: TestRouterProps) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="*" element={children} />
      </Routes>
    </MemoryRouter>
  );
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
  routePatterns?: { path: string; element: React.ReactNode }[];
}

export function renderWithRouter(
  ui: React.ReactNode,
  options: CustomRenderOptions = {}
): RenderResult {
  const { initialRoute = '/', routePatterns, ...renderOptions } = options;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MemoryRouter initialEntries={[initialRoute]}>
      {routePatterns ? (
        <Routes>
          {routePatterns.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      ) : (
        children
      )}
    </MemoryRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
export { act, describe, beforeEach };
