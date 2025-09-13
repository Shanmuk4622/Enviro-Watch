"use client";

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, LifeBuoy, LogOut, Settings, User, ShieldX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { SensorDevice } from '@/lib/types';
import { listenToDevices } from '@/lib/devices';

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case '/':
      return 'Dashboard';
    case '/map':
      return 'Live Map';
    case '/devices':
      return 'Device Management';
    case '/settings':
      return 'Settings';
    default:
      return 'EnviroWatch';
  }
};

export function Header() {
  const pathname = usePathname();
  const [devices, setDevices] = useState<SensorDevice[]>([]);

  useEffect(() => {
    const unsubscribe = listenToDevices(setDevices);
    return () => unsubscribe();
  }, []);

  const criticalDevices = devices.filter(d => d.status === 'Critical');
  const criticalAlerts = criticalDevices.length;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        <h1 className="text-xl font-semibold hidden md:block">{getPageTitle(pathname)}</h1>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="h-5 w-5" />
              {criticalAlerts > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{criticalAlerts}</Badge>
              )}
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Critical Alerts</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {criticalAlerts > 0 ? (
              criticalDevices.map(device => (
                <DropdownMenuItem key={device.id} className="flex items-start gap-3">
                  <ShieldX className="text-destructive mt-1" />
                  <div>
                    <p className="font-semibold">{device.name}</p>
                    <p className="text-xs text-muted-foreground">{device.location.name} - CO: {device.coLevel} ppm</p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <p className="p-4 text-sm text-muted-foreground text-center">No critical alerts right now.</p>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
              <Avatar>
                <AvatarImage src="https://picsum.photos/seed/1/100/100" alt="Admin User" data-ai-hint="person avatar" />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User className="mr-2" />Profile</DropdownMenuItem>
            <DropdownMenuItem><Settings className="mr-2" />Settings</DropdownMenuItem>
            <DropdownMenuItem><LifeBuoy className="mr-2" />Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><LogOut className="mr-2" />Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
