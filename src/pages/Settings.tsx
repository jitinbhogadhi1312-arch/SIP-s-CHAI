import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import type { AppSettings } from '../types';

export function Settings() {
  const { settings, updateSettings } = useAppContext();
  const [formData, setFormData] = useState<AppSettings>(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleSave = () => {
    updateSettings(formData);
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage cafe preferences and security.</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-sm text-sm font-bold transition-all flex items-center gap-2 shadow-md active:scale-95"
        >
          <Save size={16} /> Save Changes
        </button>
      </header>

      <div className="space-y-6">
        
        {/* Cafe Information */}
        <div className="bg-card border border-border shadow-sm rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/10">
            <h2 className="font-semibold">Cafe Information</h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase opacity-80">Cafe Name</label>
              <input 
                name="cafeName" 
                value={formData.cafeName} 
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-sm bg-background text-sm focus:outline-none focus:border-secondary" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase opacity-80">Owner Name</label>
              <input 
                name="ownerName" 
                value={formData.ownerName} 
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-sm bg-background text-sm focus:outline-none focus:border-secondary" 
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase opacity-80">Address</label>
              <input 
                name="address" 
                value={formData.address} 
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-sm bg-background text-sm focus:outline-none focus:border-secondary" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase opacity-80">Phone</label>
              <input 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-sm bg-background text-sm focus:outline-none focus:border-secondary" 
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-card border border-border shadow-sm rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/10">
            <h2 className="font-semibold">Security</h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase opacity-80">Owner PIN</label>
              <input 
                name="ownerPin" 
                value={formData.ownerPin} 
                onChange={handleChange}
                maxLength={4}
                className="w-full px-3 py-2 border border-border rounded-sm bg-background font-mono text-sm focus:outline-none focus:border-secondary" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase opacity-80">Staff PIN</label>
              <input 
                name="staffPin" 
                value={formData.staffPin} 
                onChange={handleChange}
                maxLength={4}
                className="w-full px-3 py-2 border border-border rounded-sm bg-background font-mono text-sm focus:outline-none focus:border-secondary" 
              />
            </div>
          </div>
        </div>

        {/* Tax & Billing */}
        <div className="bg-card border border-border shadow-sm rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/10">
            <h2 className="font-semibold">Tax & Billing</h2>
          </div>
          <div className="p-5 space-y-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  name="gstEnabled" 
                  checked={formData.gstEnabled} 
                  onChange={handleChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
              </div>
              <span className="text-sm font-medium select-none">Enable GST Calculation</span>
            </label>

            {formData.gstEnabled && (
              <div className="space-y-1.5 max-w-[200px] animate-in fade-in slide-in-from-top-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase opacity-80">GST Percentage (%)</label>
                <input 
                  type="number"
                  name="gstPercent" 
                  value={formData.gstPercent} 
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-border rounded-sm bg-background text-sm focus:outline-none focus:border-secondary" 
                />
              </div>
            )}
          </div>
        </div>

        {/* Cloud Sync */}
        <div className="bg-card border border-border shadow-sm rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/10">
            <h2 className="font-semibold">Cloud Sync (Google Sheets)</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase opacity-80">Owner WhatsApp Phone (e.g. 919876543210)</label>
              <input 
                name="ownerPhone" 
                value={formData.ownerPhone} 
                onChange={handleChange}
                placeholder="Include country code (e.g. 91...)"
                className="w-full px-3 py-2 border border-border rounded-sm bg-background text-sm focus:outline-none focus:border-secondary" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase opacity-80">Webhook URL</label>
              <div className="flex gap-2">
                <input 
                  name="sheetWebhookUrl" 
                  value={formData.sheetWebhookUrl} 
                  onChange={handleChange}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="flex-1 px-3 py-2 border border-border rounded-sm bg-background text-sm focus:outline-none focus:border-secondary font-mono" 
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!formData.sheetWebhookUrl) return toast.error("Enter a URL first");
                    try {
                      toast.info("Sending test data...");
                      const form = document.createElement('form');
                      form.method = 'POST';
                      form.action = formData.sheetWebhookUrl;
                      const iframeName = 'test_iframe_' + Date.now();
                      const iframe = document.createElement('iframe');
                      iframe.name = iframeName;
                      iframe.style.display = 'none';
                      document.body.appendChild(iframe);
                      form.target = iframeName;
                      const input = document.createElement('input');
                      input.type = 'hidden';
                      input.name = 'billData';
                      input.value = JSON.stringify({ test: true, billNumber: "TEST-001", total: 0, createdAt: new Date() });
                      form.appendChild(input);
                      document.body.appendChild(form);
                      form.submit();
                      
                      setTimeout(() => {
                        document.body.removeChild(form);
                        document.body.removeChild(iframe);
                        toast.success("Test sent! Check your sheet.");
                      }, 2000);
                    } catch (e) {
                      toast.error("Failed to send test. Check URL.");
                    }
                  }}
                  className="px-3 py-2 border border-border rounded-sm hover:bg-muted text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  Test Connection
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground italic">Paste your Google Apps Script Web App URL here to sync bills automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
