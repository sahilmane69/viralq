"use client";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Progress,
  useDisclosure,
} from "@heroui/react";
import { useState, type ReactNode } from "react";

const menuItems = [
  { label: "Dashboard", icon: "dashboard" },
  { label: "New Analysis", icon: "plus" },
  { label: "History", icon: "history" },
  { label: "Profile", icon: "profile" },
  { label: "Settings", icon: "settings" },
];

const recentAnalyses = [
  { name: "Summer product launch", date: "Jun 12, 2026", score: 87, status: "Complete" },
  { name: "Founder story hook", date: "Jun 10, 2026", score: 78, status: "Complete" },
  { name: "Feature walkthrough", date: "Jun 8, 2026", score: 91, status: "Complete" },
];

const statCards = [
  { label: "Total analyses", value: "24", detail: "6 this month", icon: "analysis" },
  { label: "Average score", value: "84", detail: "+4.2% from last month", icon: "score" },
  { label: "Videos improved", value: "18", detail: "75% implementation rate", icon: "improved" },
];

function NavIcon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5M12 7v5l3 2" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.1A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3V9.6h.1A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.17.37.38.7.6 1 .3.3.7.4 1.1.4h.1v4h-.1a1.7 1.7 0 0 0-1.7.6Z" />
      </>
    ),
    analysis: <path d="M4 19V9m5 10V5m5 14v-7m5 7V3" />,
    score: (
      <>
        <path d="m4 14 5-5 4 4 7-7" />
        <path d="M14 6h6v6" />
      </>
    ),
    improved: (
      <>
        <path d="m5 12 4 4L19 6" />
        <circle cx="12" cy="12" r="9" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}

function Brand() {
  return (
    <Link className="flex items-center gap-3 text-slate-950" href="/">
      <span className="grid size-9 place-items-center rounded-xl bg-blue-600 text-white">
        <svg
          aria-hidden="true"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="m5 7 4 10 3-7 3 7 4-10" />
        </svg>
      </span>
      <span className="font-semibold">ViralIQ</span>
    </Link>
  );
}

function SidebarContent({
  activeItem,
  onSelect,
}: {
  activeItem: string;
  onSelect: (item: string) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-6">
        <Brand />
      </div>
      <Divider />
      <nav aria-label="Dashboard navigation" className="flex-1 space-y-1 px-3 py-5">
        {menuItems.map((item) => {
          const active = activeItem === item.label;
          return (
            <Button
              key={item.label}
              className={`h-11 w-full justify-start gap-3 px-3 font-medium ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
              onPress={() => onSelect(item.label)}
              radius="lg"
              startContent={<NavIcon name={item.icon} />}
              variant="light"
            >
              {item.label}
            </Button>
          );
        })}
      </nav>
      <div className="p-4">
        <Card className="border border-slate-200 bg-slate-50 shadow-none">
          <CardBody className="p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Monthly usage</span>
              <span className="text-slate-500">24 / 50</span>
            </div>
            <Progress
              aria-label="Monthly usage"
              className="mt-3"
              color="primary"
              size="sm"
              value={48}
            />
            <p className="mt-3 text-xs leading-5 text-slate-500">26 analyses remaining</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const selectItem = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <SidebarContent activeItem={activeItem} onSelect={selectItem} />
      </aside>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="left" size="xs">
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="sr-only">Dashboard navigation</DrawerHeader>
              <DrawerBody className="p-0">
                <SidebarContent
                  activeItem={activeItem}
                  onSelect={(item) => {
                    selectItem(item);
                    onClose();
                  }}
                />
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              isIconOnly
              aria-label="Open navigation"
              className="text-slate-700 lg:hidden"
              onPress={onOpen}
              radius="lg"
              variant="light"
            >
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </Button>
            <div className="lg:hidden">
              <Brand />
            </div>
            <p className="hidden text-sm text-slate-500 sm:block lg:hidden">/ {activeItem}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button isIconOnly aria-label="Notifications" radius="full" variant="light">
              <svg
                className="size-5 text-slate-600"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
              </svg>
            </Button>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button className="h-11 gap-3 bg-transparent px-2" variant="light">
                  <Avatar
                    className="bg-blue-100 text-blue-700"
                    name="RM"
                    size="sm"
                  />
                  <span className="hidden text-left sm:block">
                    <span className="block text-sm font-semibold text-slate-800">Rutuja Mane</span>
                    <span className="block text-xs text-slate-500">Content strategist</span>
                  </span>
                  <svg
                    className="hidden size-4 text-slate-400 sm:block"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile actions">
                <DropdownItem key="profile">View profile</DropdownItem>
                <DropdownItem key="settings">Settings</DropdownItem>
                <DropdownItem key="logout" className="text-danger" color="danger">
                  Log out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium text-blue-600">Overview</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Welcome back, Rutuja
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Here is how your content has been performing.
                </p>
              </div>
              <Button
                className="w-full bg-blue-600 px-5 font-semibold text-white sm:w-auto"
                radius="lg"
                startContent={<NavIcon name="plus" />}
              >
                New analysis
              </Button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {statCards.map((stat) => (
                <Card key={stat.label} className="border border-slate-200 shadow-none">
                  <CardBody className="flex-row items-start justify-between p-5">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                      <p className="mt-2 text-3xl font-semibold tracking-tight">{stat.value}</p>
                      <p className="mt-2 text-xs text-slate-500">{stat.detail}</p>
                    </div>
                    <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700">
                      <NavIcon name={stat.icon} />
                    </span>
                  </CardBody>
                </Card>
              ))}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.75fr]">
              <Card className="border border-slate-200 shadow-none">
                <CardBody className="p-0">
                  <div className="flex items-center justify-between px-5 py-5 sm:px-6">
                    <div>
                      <h2 className="font-semibold">Recent analyses</h2>
                      <p className="mt-1 text-sm text-slate-500">Your latest video reports</p>
                    </div>
                    <Button className="font-semibold text-blue-600" size="sm" variant="light">
                      View all
                    </Button>
                  </div>
                  <Divider />
                  <div className="divide-y divide-slate-100">
                    {recentAnalyses.map((analysis) => (
                      <div
                        key={analysis.name}
                        className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
                            <svg
                              className="size-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              viewBox="0 0 24 24"
                            >
                              <path d="m9 7 8 5-8 5V7Z" />
                              <rect x="3" y="3" width="18" height="18" rx="3" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{analysis.name}</p>
                            <p className="mt-1 text-xs text-slate-500">{analysis.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                          <Chip color="success" size="sm" variant="flat">
                            {analysis.status}
                          </Chip>
                          <div className="min-w-12 text-right">
                            <p className="text-lg font-semibold">{analysis.score}</p>
                            <p className="text-[10px] uppercase tracking-wide text-slate-400">Score</p>
                          </div>
                          <Button isIconOnly aria-label={`Open ${analysis.name}`} size="sm" variant="light">
                            <svg
                              className="size-4 text-slate-500"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              <Card className="border border-slate-200 shadow-none">
                <CardBody className="p-6">
                  <div className="grid size-12 place-items-center rounded-xl bg-blue-600 text-white">
                    <NavIcon name="plus" />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold">Analyze a new video</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Upload your latest short-form video and get a clear performance report in
                    minutes.
                  </p>
                  <Button className="mt-6 w-full bg-slate-950 font-semibold text-white" radius="lg">
                    Start analysis
                  </Button>
                  <p className="mt-3 text-center text-xs text-slate-400">
                    Supports MP4, MOV, and WebM
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
