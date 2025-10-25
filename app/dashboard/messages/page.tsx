'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { formatDate, getRelativeTime } from '../../utils/helpers';
import { mockMessages, mockUsers } from '../../data/mockData';
import {
  MessageCircle,
  Plus,
  Search,
  Send,
  Paperclip,
  MoreHorizontal,
  Reply,
  Download
} from 'lucide-react';

export default function MessagesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [newMessageForm, setNewMessageForm] = useState({
    recipient: '',
    subject: '',
    content: ''
  });
  const [replyContent, setReplyContent] = useState('');

  if (!user) return null;

  // Filter messages for current user
  const userMessages = mockMessages.filter(msg =>
    msg.senderId === user.id || msg.receiverId === user.id
  );

  const filteredMessages = userMessages.filter(msg =>
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSender = (senderId: string) => {
    return mockUsers.find(u => u.id === senderId);
  };

  const getReceiver = (receiverId: string) => {
    return mockUsers.find(u => u.id === receiverId);
  };

  const handleNewMessage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New message:', newMessageForm);
    setIsNewMessageOpen(false);
    setNewMessageForm({ recipient: '', subject: '', content: '' });
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reply:', replyContent);
    setReplyContent('');
  };

  const unreadCount = userMessages.filter(msg => !msg.isRead && msg.receiverId === user.id).length;

  const getOtherParticipants = () => {
    return mockUsers.filter(u => u.id !== user.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with tenants, property managers, and service providers
          </p>
        </div>
        <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Compose New Message</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleNewMessage} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">To</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newMessageForm.recipient}
                  onChange={(e) => setNewMessageForm({ ...newMessageForm, recipient: e.target.value })}
                  required
                >
                  <option value="">Select recipient</option>
                  {getOtherParticipants().map(participant => (
                    <option key={participant.id} value={participant.id}>
                      {participant.name} ({participant.role.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newMessageForm.subject}
                  onChange={(e) => setNewMessageForm({ ...newMessageForm, subject: e.target.value })}
                  placeholder="Enter message subject"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  value={newMessageForm.content}
                  onChange={(e) => setNewMessageForm({ ...newMessageForm, content: e.target.value })}
                  placeholder="Type your message here..."
                  rows={4}
                  required
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsNewMessageOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{userMessages.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {userMessages.filter(msg => msg.senderId === user.id).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Received</CardTitle>
            <Reply className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {userMessages.filter(msg => msg.receiverId === user.id).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredMessages.map((message) => {
                const isReceived = message.receiverId === user.id;
                const otherUser = isReceived ? getSender(message.senderId) : getReceiver(message.receiverId);

                return (
                  <div
                    key={message.id}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors ${selectedMessage?.id === message.id ? 'bg-accent border-primary' : ''
                      } ${!message.isRead && isReceived ? 'bg-blue-50 border-blue-200' : ''}`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={otherUser?.avatar} />
                        <AvatarFallback>{otherUser?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{otherUser?.name}</p>
                          {!message.isRead && isReceived && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-muted-foreground truncate">
                          {message.subject}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getRelativeTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredMessages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No messages found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedMessage ? 'Message Details' : 'Select a Message'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">{selectedMessage.subject}</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={getSender(selectedMessage.senderId)?.avatar} />
                        <AvatarFallback>{getSender(selectedMessage.senderId)?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        From: {getSender(selectedMessage.senderId)?.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getSender(selectedMessage.senderId)?.role.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedMessage.createdAt)}
                    </p>
                  </div>

                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <Separator />

                <div className="prose max-w-none">
                  <p className="text-sm whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>

                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-sm mb-2">Attachments</h4>
                      <div className="space-y-2">
                        {selectedMessage.attachments.map((attachment: string, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <Paperclip className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{attachment.split('/').pop()}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Reply Form */}
                <form onSubmit={handleReply} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reply">Reply</Label>
                    <Textarea
                      id="reply"
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
                    <Button type="submit" disabled={!replyContent.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Select a message</h3>
                <p>Choose a conversation from the left to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
