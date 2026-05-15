'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export type POIType = 'historic' | 'view' | 'adventure' | 'culture';

export interface POI {
  id: string;
  name: string;
  coordinates: [number, number]; // lat, lng
  description: string;
  lore: string;
  points: number;
  type: POIType;
  imageUrl: string;
}

interface User {
  id: string;
  username: string;
  points: number;
  rank: string;
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

interface GameState {
  points: number;
  unlockedPOIs: string[];
}

export interface LeaderboardEntry {
  username: string;
  points: number;
  rank: string;
}

export interface FeedEntry {
  id: string;
  user: { username: string; rank: string };
  poi: { name: string; type: string };
  createdAt: string;
}

interface GameContextType {
  gameState: GameState;
  rank: string;
  pois: POI[];
  leaderboard: LeaderboardEntry[];
  feed: FeedEntry[];
  checkIn: (poiId: string) => Promise<{ success: boolean; newLore?: string; newRank?: string }>;
  refreshSocial: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');

export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState>({ points: 0, unlockedPOIs: [] });
  const [pois, setPois] = useState<POI[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [feed, setFeed] = useState<FeedEntry[]>([]);

  useEffect(() => {
    // Load from LocalStorage
    const storedUser = localStorage.getItem('gerege_auth');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchProfile(JSON.parse(storedUser).access_token);
    }
    fetchPOIs();
    refreshSocial();
  }, []);

  const refreshSocial = async () => {
    try {
      const [lbRes, feedRes] = await Promise.all([
        fetch(`${API_URL}/api/leaderboard`),
        fetch(`${API_URL}/api/feed`)
      ]);
      if (lbRes.ok) setLeaderboard(await lbRes.json());
      if (feedRes.ok) setFeed(await feedRes.json());
    } catch (e) {
      console.error('Failed to refresh social data', e);
    }
  };

  const fetchPOIs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pois`);
      if (res.ok) {
        const data = await res.json();
        setPois(data.map((d: any) => ({ ...d, coordinates: [d.latitude, d.longitude] })));
      }
    } catch (e) {
      console.error('Failed to fetch POIs', e);
    }
  };

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGameState({
          points: data.points,
          unlockedPOIs: data.unlockedPOIs
        });
        setUser(prev => prev ? { ...prev, points: data.points, rank: data.rank } : null);
      }
    } catch (e) {
      console.error('Failed to fetch profile', e);
    }
  };

  const login = async (username: string, password?: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        toast.error('Invalid credentials');
        return false;
      }

      const data = await res.json();
      const newUser = { ...data.user, access_token: data.access_token };
      setUser(newUser);
      localStorage.setItem('gerege_auth', JSON.stringify(newUser));
      await fetchProfile(data.access_token);
      return true;
    } catch (e) {
      toast.error('Failed to connect to server');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gerege_auth');
    setGameState({ points: 0, unlockedPOIs: [] });
  };

  const checkIn = async (poiId: string) => {
    if (!user) return { success: false };
    if (gameState.unlockedPOIs.includes(poiId)) return { success: false };

    try {
      const res = await fetch(`${API_URL}/api/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify({ poiId })
      });

      if (!res.ok) {
        toast.error('Failed to check in');
        return { success: false };
      }

      const data = await res.json();

      setGameState(prev => ({
        points: data.newTotalPoints,
        unlockedPOIs: [...prev.unlockedPOIs, poiId],
      }));
      setUser(prev => prev ? { ...prev, points: data.newTotalPoints, rank: data.newRank || prev.rank } : null);

      await refreshSocial();

      return {
        success: true,
        newLore: data.lore,
        newRank: data.newRank,
      };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <GameContext.Provider value={{
        gameState,
        rank: user?.rank || 'Novice',
        pois,
        leaderboard,
        feed,
        checkIn,
        refreshSocial
      }}>
        {children}
      </GameContext.Provider>
    </AuthContext.Provider>
  );
}
