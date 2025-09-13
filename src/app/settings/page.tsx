'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { mockAlertRules } from "@/lib/data";
import { AlertRule } from "@/lib/types";
import { BellRing, Edit, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


function AlertRuleCard({ rule, onToggle }: { rule: AlertRule, onToggle: (id: string, enabled: boolean) => void }) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="flex items-center gap-2"><BellRing className="w-5 h-5 text-primary" /> {rule.name}</CardTitle>
                <CardDescription>Triggers when CO level is above {rule.threshold} ppm for {rule.timeframe} min.</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
                <Edit className="w-4 h-4" />
            </Button>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-between items-center">
        <span className={`text-sm font-medium ${rule.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
            {rule.enabled ? 'Enabled' : 'Disabled'}
        </span>
        <Switch
          id={`rule-toggle-${rule.id}`}
          checked={rule.enabled}
          onCheckedChange={(checked) => onToggle(rule.id, checked)}
        />
      </CardFooter>
    </Card>
  );
}

export default function SettingsPage() {
  const [rules, setRules] = useState(mockAlertRules);

  const handleToggle = (id: string, enabled: boolean) => {
    setRules(currentRules =>
      currentRules.map(rule =>
        rule.id === id ? { ...rule, enabled } : rule
      )
    );
  };
  
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">Alert Rule Configuration</h1>
        <p className="text-muted-foreground">
          Create and manage rules to trigger notifications for CO level breaches.
        </p>
      </div>

      <div className="flex justify-end">
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Rule
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rules.map(rule => (
          <AlertRuleCard key={rule.id} rule={rule} onToggle={handleToggle} />
        ))}
      </div>
    </div>
  );
}
