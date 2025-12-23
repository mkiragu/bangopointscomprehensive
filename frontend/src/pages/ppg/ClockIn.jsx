import React from 'react';
import { Clock } from 'lucide-react';
const PPGClockIn = () => <div className="space-y-6"><h1 className="text-3xl font-bold text-accent-primary">Clock In/Out</h1><div className="card text-center py-12"><Clock className="w-16 h-16 text-accent-primary mx-auto mb-4" /><button className="btn-primary">Clock In</button></div></div>;
export default PPGClockIn;
