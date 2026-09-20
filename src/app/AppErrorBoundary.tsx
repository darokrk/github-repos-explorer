import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';
import { MessageView } from '@/shared/ui';

interface AppErrorBoundaryProps {
  readonly children: ReactNode;
}

interface AppErrorBoundaryState {
  readonly hasError: boolean;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  override state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error', error, info.componentStack);
  }

  private readonly handleReset = () => {
    this.setState({ hasError: false });
  };

  override render() {
    if (this.state.hasError) {
      return (
        <MessageView
          title="Something broke"
          detail="The screen ran into an unexpected error. You can try again."
          actionLabel="Reload screen"
          onAction={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}
