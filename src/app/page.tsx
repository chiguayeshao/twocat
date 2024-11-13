'use client';
import { BaseLayout } from "@/components/layout/BaseLayout";

export default function Home() {
  return (
    <BaseLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">交易信息</h1>
          <p className="text-muted-foreground">
            交易信息交易信息交易信息
          </p>
        </div>

        {/* 其他概览内容 */}
      </div>
    </BaseLayout>
  );
}
