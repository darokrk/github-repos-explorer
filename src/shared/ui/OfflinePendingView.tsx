import { MessageView } from './MessageView';

const DEFAULT_DETAIL =
  'This search has never been loaded, so there is nothing cached to show. It runs by itself once the connection is back.';

export interface OfflinePendingViewProps {
  readonly detail?: string;
}

/**
 * Shown when a query is paused because the device is offline and no cached data exists for it.
 * Without this branch the query stays pending forever and the screen would hold a loading state
 * that can never resolve.
 */
export function OfflinePendingView({ detail = DEFAULT_DETAIL }: OfflinePendingViewProps) {
  return <MessageView title="No connection" detail={detail} />;
}
