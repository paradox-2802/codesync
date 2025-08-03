import React from 'react'
import { Code2 } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600">
        <Code2 className="h-5 w-5 text-white" />
      </div>
      <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        CodeSync
      </span>
    </div>
  );
}
export default Logo;