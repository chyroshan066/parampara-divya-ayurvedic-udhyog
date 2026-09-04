"use client";

import { useState } from "react";
import { EnvelopeSimple, EnvelopeSimpleOpen, Trash } from "@phosphor-icons/react";
import type { ContactMessage } from "@/types/contact";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function MessagesList({
  initialMessages,
}: {
  initialMessages: ContactMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const markRead = async (id: string, isRead: boolean) => {
    setPendingIds((prev) => new Set(prev).add(id));
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead } : m)));

    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead }),
      });
      if (!res.ok) throw new Error("Request failed");
    } catch {
      // Revert the optimistic update if the request failed
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: !isRead } : m))
      );
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Delete this message? This can't be undone."
    );
    if (!confirmed) return;

    setDeletingId(id);
    const previousMessages = messages;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (expandedId === id) setExpandedId(null);

    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Request failed");
    } catch {
      // Restore the message if deletion failed
      setMessages(previousMessages);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = (message: ContactMessage) => {
    const isExpanding = expandedId !== message.id;
    setExpandedId(isExpanding ? message.id : null);

    if (isExpanding && !message.isRead) {
      markRead(message.id, true);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="tw:bg-white tw:rounded-3xl tw:border tw:border-gray-100 tw:p-10 tw:text-center tw:text-slate-800/60">
        No messages yet. Submissions from the contact form will show up here.
      </div>
    );
  }

  return (
    <div className="tw:bg-white tw:rounded-3xl tw:border tw:border-gray-100 tw:overflow-hidden tw:max-w-3xl">
      {messages.map((message, index) => {
        const isExpanded = expandedId === message.id;
        const isPending = pendingIds.has(message.id);
        const isDeleting = deletingId === message.id;

        return (
          <div
            key={message.id}
            className={index !== 0 ? "tw:border-t tw:border-gray-100" : ""}
          >
            <button
              type="button"
              onClick={() => handleToggle(message)}
              className="tw:w-full tw:flex tw:items-center tw:gap-x-3 tw:sm:gap-x-4 tw:px-4 tw:sm:px-6 tw:py-4 tw:text-left tw:transition-colors tw:hover:bg-gray-50"
            >
              <span
                className={`tw:flex tw:items-center tw:justify-center tw:w-9 tw:h-9 tw:rounded-full tw:shrink-0 ${
                  message.isRead
                    ? "tw:bg-gray-100 tw:text-slate-400"
                    : "tw:bg-primary/10 tw:text-primary"
                }`}
              >
                {message.isRead ? (
                  <EnvelopeSimpleOpen className="tw:w-4 tw:h-4" weight="bold" />
                ) : (
                  <EnvelopeSimple className="tw:w-4 tw:h-4" weight="bold" />
                )}
              </span>

              <span className="tw:flex-1 tw:min-w-0">
                <span className="tw:flex tw:items-center tw:gap-x-2">
                  <span
                    className={`tw:text-sm tw:truncate ${
                      message.isRead
                        ? "tw:font-medium tw:text-slate-600"
                        : "tw:font-bold tw:text-slate-800"
                    }`}
                  >
                    {message.firstName} {message.lastName}
                  </span>
                  {!message.isRead && (
                    <span className="tw:w-2 tw:h-2 tw:rounded-full tw:bg-primary tw:shrink-0" />
                  )}
                </span>
                <span className="tw:block tw:text-xs tw:text-slate-800/60 tw:truncate">
                  {message.subject || "(No subject)"}
                </span>
              </span>

              <span className="tw:text-xs tw:text-slate-800/40 tw:shrink-0 tw:whitespace-nowrap">
                {formatDate(message.createdAt)}
              </span>
            </button>

            {isExpanded && (
              <div className="tw:px-4 tw:sm:px-6 tw:pb-5 tw:pl-4 tw:sm:pl-[4.75rem]">
                <p className="tw:text-sm tw:text-slate-800 tw:whitespace-pre-wrap tw:break-words tw:mb-4">
                  {message.message}
                </p>

                <a
                  href={`mailto:${message.email}`}
                  className="tw:block tw:text-sm tw:font-bold tw:text-primary tw:hover:underline tw:break-all tw:mb-3"
                >
                  {message.email}
                </a>

                <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => markRead(message.id, !message.isRead)}
                    className="tw:inline-flex tw:items-center tw:gap-x-1.5 tw:rounded-full tw:border tw:border-gray-200 tw:bg-white tw:px-3 tw:py-1.5 tw:text-xs tw:font-bold tw:text-slate-600 tw:transition-colors tw:hover:border-primary tw:hover:text-primary tw:disabled:opacity-50"
                  >
                    {message.isRead ? (
                      <EnvelopeSimple className="tw:w-3.5 tw:h-3.5" weight="bold" />
                    ) : (
                      <EnvelopeSimpleOpen className="tw:w-3.5 tw:h-3.5" weight="bold" />
                    )}
                    Mark as {message.isRead ? "unread" : "read"}
                  </button>

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => handleDelete(message.id)}
                    className="tw:inline-flex tw:items-center tw:gap-x-1.5 tw:rounded-full tw:border tw:border-red-200 tw:bg-white tw:px-3 tw:py-1.5 tw:text-xs tw:font-bold tw:text-red-500 tw:transition-colors tw:hover:border-red-300 tw:hover:bg-red-50 tw:hover:text-red-700 tw:disabled:opacity-50"
                  >
                    <Trash className="tw:w-3.5 tw:h-3.5" weight="bold" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}