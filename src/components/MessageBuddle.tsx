import { AvatarGroupCount } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { IFile } from '@/hooks/useChatMessages';
import { DownloadIcon, UndoIcon, QuoteIcon } from 'lucide-react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu.tsx';
import { FileDisplay } from './FileDisplay';

export type Message = {
    username: string;
    msg: string;
    time: number;
    type?: 'name' | 'share';
    recalled?: boolean;
    quoteTimeStamp?: number;
};

type MessageBubbleProps = {
    quoteMessage?: Message;
    message: Message;
    currentUsername: string;
    formatTime: (timestamp: number) => string;
    handleRecall: (message: Message) => void;
    setQuoteMessage: (message: Message | undefined) => void;
};

export const MessageBubble = ({
    quoteMessage,
    message,
    currentUsername,
    formatTime,
    handleRecall,
    setQuoteMessage,
}: MessageBubbleProps) => {
    const isCurrentUser = message.username === currentUsername;

    let fileData: IFile | null = null;
    if (message.type === 'share') {
        try {
            fileData = JSON.parse(message.msg);
        } catch {
            fileData = null;
        }
    }

    const downloadUrl = fileData?.link?.includes('python_assets/')
        ? `https://livefile.xesimg.com/programme/python_assets/844958913c304c040803a9d7f79f898e.html?name=${fileData.name}&file=${fileData.link.split('python_assets/')[1]}`
        : '';

    return (
        <div className={cn('flex mb-4', isCurrentUser ? 'justify-end' : 'justify-start')}>
            <div className={cn('max-w-[70%] flex items-start gap-3', isCurrentUser && 'flex-row-reverse')}>
                <AvatarGroupCount>{message.username ? message.username[0] : '?'}</AvatarGroupCount>
                <div className={cn('flex mb-2', isCurrentUser ? 'justify-end' : 'justify-start')}>
                    <div
                        className={cn(
                            'flex flex-col max-w-xs sm:max-w-sm lg:max-w-md',
                            isCurrentUser ? 'items-end' : 'items-start',
                        )}
                    >
                        <div className={cn('flex gap-1 min-w-12', isCurrentUser ? 'items-end' : 'items-start')}>
                            <span className="text-xs truncate">{message.username}</span>
                            <span className="text-xs">{formatTime(message.time)}</span>
                        </div>

                        <div className={cn('flex items-end gap-2', isCurrentUser ? 'flex-row-reverse' : 'flex-row')}>
                            <ContextMenu>
                                <ContextMenuTrigger>
                                    <div
                                        className={cn(
                                            'rounded-2xl px-4 py-2 shadow-sm',
                                            isCurrentUser
                                                ? 'bg-primary text-background rounded-br-none'
                                                : 'bg-surface border border-border text-text-primary rounded-bl-none',
                                        )}
                                    >
                                        {quoteMessage && (
                                            <div
                                                className={cn(
                                                    'text-xs p-2 mb-2 rounded border-l-4 overflow-hidden',
                                                    isCurrentUser
                                                        ? 'bg-indigo-900/30 border-indigo-400 text-indigo-100'
                                                        : 'bg-slate-50 border-slate-400 text-slate-800',
                                                )}
                                            >
                                                <p className="font-bold mb-0.5">@{quoteMessage.username}</p>
                                                <div className="prose prose-sm max-w-none prose-p:my-0 prose-headings:my-1 prose-ul:my-0 prose-ol:my-0 prose-li:my-0 prose-pre:my-1">
                                                    {quoteMessage.type !== 'share' ? (
                                                        quoteMessage.msg
                                                    ) : (
                                                        <FileDisplay
                                                            fileData={JSON.parse(quoteMessage.msg)}
                                                            isCurrentUser={isCurrentUser}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {message.type !== 'share' ? (
                                            <p className="text-sm wrap-break-word whitespace-pre-wrap">{message.msg}</p>
                                        ) : (
                                            fileData && (
                                                <FileDisplay fileData={fileData} isCurrentUser={isCurrentUser} />
                                            )
                                        )}
                                    </div>
                                </ContextMenuTrigger>

                                {!message.recalled && (
                                    <ContextMenuContent>
                                        <ContextMenuGroup>
                                            {message.type === 'share' && downloadUrl && (
                                                <ContextMenuItem onClick={() => window.open(downloadUrl, '_blank')}>
                                                    <DownloadIcon />
                                                    下载
                                                </ContextMenuItem>
                                            )}
                                            {isCurrentUser && !message.recalled && (
                                                <ContextMenuItem onClick={() => handleRecall(message)}>
                                                    <UndoIcon />
                                                    撤回
                                                </ContextMenuItem>
                                            )}
                                            <ContextMenuItem onClick={() => setQuoteMessage(message)}>
                                                <QuoteIcon />
                                                引用
                                            </ContextMenuItem>
                                        </ContextMenuGroup>
                                    </ContextMenuContent>
                                )}
                            </ContextMenu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
