"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Pin,
  Lock,
  Trash2,
  Calendar,
  Eye,
  MessageSquare,
  Heart,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

interface User {
  id: number;
  nama: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

interface Reply {
  id: number;
  content: string;
  user: User;
  like_count: number;
  created_at: string;
}

interface Thread {
  id: number;
  title: string;
  content: string;
  user: User;
  category: Category;
  is_pinned: boolean;
  is_locked: boolean;
  is_private: boolean;
  view_count: number;
  reply_count: number;
  like_count: number;
  created_at: string;
  replies: Reply[];
}

export default function AdminForumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const threadId = params.id as string;

  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThread();
  }, [threadId]);

  const loadThread = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/forum/threads/${threadId}`);
      
      // Check jika private, admin tidak boleh akses
      if (response.data.is_private) {
        alert("Admin tidak memiliki akses ke pertanyaan private");
        router.push("/dashboard/admin/forum");
        return;
      }
      
      setThread(response.data);
    } catch (error: any) {
      console.error("Error loading thread:", error);
      if (error.response?.status === 403) {
        alert("Admin tidak memiliki akses ke pertanyaan private");
        router.push("/dashboard/admin/forum");
      } else {
        alert("Thread tidak ditemukan");
        router.push("/dashboard/admin/forum");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePinThread = async () => {
    try {
      await api.post(`/admin/forum/threads/${threadId}/pin`);
      alert("Status pin berhasil diubah");
      loadThread();
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal mengubah status pin");
    }
  };

  const handleLockThread = async () => {
    try {
      await api.post(`/admin/forum/threads/${threadId}/lock`);
      alert("Status lock berhasil diubah");
      loadThread();
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal mengubah status lock");
    }
  };

  const handleDeleteThread = async () => {
    if (!confirm("Hapus thread ini? Tindakan ini tidak dapat dibatalkan!")) return;

    try {
      await api.delete(`/admin/forum/threads/${threadId}/force`);
      alert("Thread berhasil dihapus");
      router.push("/dashboard/admin/forum");
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal menghapus thread");
    }
  };

  const handleDeleteReply = async (replyId: number) => {
    if (!confirm("Hapus balasan ini?")) return;

    try {
      await api.delete(`/forum/replies/${replyId}`);
      alert("Balasan berhasil dihapus");
      loadThread();
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal menghapus balasan");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat diskusi...</p>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600">Thread tidak ditemukan</p>
          <Link href="/dashboard/admin/forum">
            <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
              Kembali ke Forum
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href="/dashboard/admin/forum">
          <Button variant="ghost" className="hover:bg-emerald-100 text-emerald-700 font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Forum
          </Button>
        </Link>

        {/* Admin Control Panel */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-purple-600" />
              <div>
                <p className="font-bold text-purple-900">Panel Kontrol Admin</p>
                <p className="text-sm text-purple-700">Kelola diskusi publik ini</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePinThread}
                className={`${
                  thread.is_pinned
                    ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                    : "hover:bg-yellow-50"
                }`}
              >
                <Pin className="w-4 h-4 mr-1" />
                {thread.is_pinned ? "Unpin" : "Pin Thread"}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleLockThread}
                className={`${
                  thread.is_locked
                    ? "bg-red-100 text-red-700 border-red-300"
                    : "hover:bg-red-50"
                }`}
              >
                <Lock className="w-4 h-4 mr-1" />
                {thread.is_locked ? "Unlock" : "Lock Thread"}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleDeleteThread}
                className="text-red-600 hover:bg-red-50 border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Hapus Thread
              </Button>
            </div>
          </div>
        </Card>

        {/* Thread Card */}
        <Card className="p-8 border-none shadow-2xl bg-white">
          {/* Category & Status Badges */}
          <div className="mb-4 flex items-center gap-3 flex-wrap">
            <Badge
              style={{
                backgroundColor: thread.category.color,
                color: "white",
              }}
              className="text-sm px-3 py-1 shadow-md"
            >
              {thread.category.icon} {thread.category.name}
            </Badge>
            {thread.is_pinned && (
              <Badge className="bg-yellow-500 text-white shadow-md">
                <Pin className="w-3 h-3 mr-1" />
                Pinned
              </Badge>
            )}
            {thread.is_locked && (
              <Badge className="bg-red-500 text-white shadow-md">
                <Lock className="w-3 h-3 mr-1" />
                Locked
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{thread.title}</h1>

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {thread.user.nama.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-800">{thread.user.nama}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(thread.created_at)}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {thread.content}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <Eye className="w-5 h-5" />
              <span className="font-semibold">{thread.view_count}</span>
              <span className="text-sm">dilihat</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <MessageSquare className="w-5 h-5" />
              <span className="font-semibold">{thread.reply_count}</span>
              <span className="text-sm">balasan</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">{thread.like_count}</span>
              <span className="text-sm">dukungan</span>
            </div>
          </div>
        </Card>

        {/* Replies Section */}
        {thread.replies.length > 0 && (
          <Card className="p-8 border-none shadow-xl bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
              {thread.reply_count} Balasan
            </h2>

            <div className="space-y-4">
              {thread.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {reply.user.nama.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Reply Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-bold text-gray-800">{reply.user.nama}</p>
                          <p className="text-xs text-gray-500">{formatDate(reply.created_at)}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteReply(reply.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-gray-700 mb-3 whitespace-pre-wrap leading-relaxed">
                        {reply.content}
                      </p>

                      {/* Like Count */}
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Heart className="w-4 h-4" />
                        <span>{reply.like_count} dukungan</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}