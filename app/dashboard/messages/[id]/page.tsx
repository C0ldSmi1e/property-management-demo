'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { formatDate, getRelativeTime } from '../../../utils/helpers';
import { mockMessages, mockUsers } from '../../../data/mockData';
import {
  MessageCircle,
  Reply,
  Forward,
  Archive,
  ArrowLeft,
  Send,
  Paperclip,
  Download,
  Star,
  Trash2,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react';

interface MessageDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MessageDetailPage({ params }: MessageDetailPageProps) {
  const { user } = useAuth();
  const resolvedParams = React.use(params);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const message = mockMessages.find(msg => msg.id === resolvedParams.id);

  if (!message) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Message not found</h3>
            <p className="text-muted-foreground mb-4">
              The message you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/dashboard/messages">
                Back to Messages
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sender = mockUsers.find(u => u.id === message.senderId);
  const receiver = mockUsers.find(u => u.id === message.receiverId);
  const isReceived = message.receiverId === user?.id;

  // Mock conversation thread
  const conversationThread = [
    message,
    ...(message.id === '1' ? [{
      id: '2',
      senderId: '1',
      receiverId: '2',
      subject: 'Re: Noise Complaint',
      content: 'Hi Mike, Thank you for bringing this to my attention. I will speak with the upstairs tenant and ensure this issue is resolved promptly.',
      isRead: true,
      createdAt: '2024-10-23T09:30:00Z'
    }] : [])
  ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      console.log('Sending reply:', {
        originalMessageId: message.id,
        content: replyContent,
        senderId: user?.id,
        receiverId: isReceived ? message.senderId : message.receiverId
      });
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const handleMarkAsRead = () => {
    console.log('Marking message as read:', message.id);
  };

  const handleArchive = () => {
    console.log('Archiving message:', message.id);
  };

  const handleDelete = () => {
    console.log('Deleting message:', message.id);
  };

  const getMessageStatus = (msg: any) => {
    if (msg.isRead) {
      return <CheckCheck className="w-4 h-4 text-blue-600" />;
    } else {
      return <Check className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard/messages" className="hover:text-foreground flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Messages
            </Link>
            <span>/</span>
            <span>{message.subject}</span>
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6" />
            <h1 className="text-3xl font-bold tracking-tight">{message.subject}</h1>
          </div>
          <div className="flex items-center gap-2">
            {!message.isRead && isReceived && (
              <Badge variant="destructive">Unread</Badge>
            )}
            <Badge variant="outline">
              {isReceived ? 'Received' : 'Sent'}
            </Badge>
            <Badge variant="secondary">
              {getRelativeTime(message.createdAt)}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          {!message.isRead && isReceived && (
            <Button variant="outline" onClick={handleMarkAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Mark as Read
            </Button>
          )}
          <Button variant="outline" onClick={() => setIsReplying(!isReplying)}>
            <Reply className="mr-2 h-4 w-4" />
            Reply
          </Button>
          <Button variant="outline">
            <Forward className="mr-2 h-4 w-4" />
            Forward
          </Button>
          <Button variant="outline" onClick={handleArchive}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>
        </div>
      </div>

      {/* Message Thread */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {conversationThread.map((msg, index) => {
              const msgSender = mockUsers.find(u => u.id === msg.senderId);
              const isSentByCurrentUser = msg.senderId === user?.id;

              return (
                <div key={msg.id} className="space-y-3">
                  <div className={`flex gap-3 ${isSentByCurrentUser ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msgSender?.avatar} />
                      <AvatarFallback>{msgSender?.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className={`flex-1 max-w-[80%] ${isSentByCurrentUser ? 'text-right' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{msgSender?.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {msgSender?.role.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(msg.createdAt)}
                        </span>
                        {isSentByCurrentUser && getMessageStatus(msg)}
                      </div>

                      <div className={`p-3 rounded-lg ${isSentByCurrentUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                        }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>

                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {msg.attachments.map((attachment: string, attachIndex: number) => (
                            <div key={attachIndex} className="flex items-center gap-2 text-xs">
                              <Paperclip className="w-3 h-3" />
                              <span>{attachment.split('/').pop()}</span>
                              <Button variant="ghost" size="sm" className="h-auto p-0">
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {index < conversationThread.length - 1 && <Separator />}
                </div>
              );
            })}

            {/* Reply Form */}
            {isReplying && (
              <>
                <Separator />
                <form onSubmit={handleReply} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{user?.name}</span>
                      <span className="text-xs text-muted-foreground">replying to {sender?.name}</span>
                    </div>
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your reply here..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" type="button">
                      <Paperclip className="w-4 h-4 mr-2" />
                      Attach File
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsReplying(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={!replyContent.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </CardContent>
        </Card>

        {/* Message Details Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Message Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">From</span>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={sender?.avatar} />
                    <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{sender?.name}</p>
                    <p className="text-xs text-muted-foreground">{sender?.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">To</span>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={receiver?.avatar} />
                    <AvatarFallback>{receiver?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{receiver?.name}</p>
                    <p className="text-xs text-muted-foreground">{receiver?.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Sent</span>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(message.createdAt)}</span>
                </div>
                <p className="text-xs text-muted-foreground">{getRelativeTime(message.createdAt)}</p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Status</span>
                <div className="flex items-center gap-2 mt-1">
                  {getMessageStatus(message)}
                  <span className="text-sm">{message.isRead ? 'Read' : 'Unread'}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Star className="w-4 h-4 mr-2" />
                Star Message
              </Button>

              <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleArchive}>
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </Button>

              <Button variant="destructive" size="sm" className="w-full justify-start" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
