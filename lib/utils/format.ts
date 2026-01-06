import { format as dateFnsFormat, formatDistanceToNow } from "date-fns";

export const formatDate = (date: string | Date, format = "PPp") => {
  return dateFnsFormat(new Date(date), format);
};

export const formatRelativeTime = (date: string | Date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatCurrency = (amount: number, currency = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-NG").format(num);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

