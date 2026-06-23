import React from 'react';
import { Flame } from 'lucide-react';
import './HotPicksDrawer.css';

const HotPicksTab = ({ onClick }) => {
  return (
    <button className="hot-picks-tab" onClick={onClick}>
      <Flame size={18} color="#C0872A" fill="#C0872A" />
      <span>Hot Picks</span>
    </button>
  );
};

export default HotPicksTab;
