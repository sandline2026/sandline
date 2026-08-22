import React from "react";

interface AdminHeaderProps {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

export default function AdminHeader({ title, subtitle, actions }: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <div className="admin-header-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {actions && <div className="admin-header-actions">{actions}</div>}
    </header>
  );
}
