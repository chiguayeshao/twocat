'use client';

import { Input } from '@/components/ui/input';
import { Search, X, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import debounce from 'lodash/debounce';

interface SearchResult {
  id: string;
  type: 'wallet' | 'recent';
  name: string;
  avatar?: string;
  description?: string;
  address?: string;
}

interface TokenOverview {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  price: number;
  logoURI: string;
  extensions: {
    description?: string;
    website?: string;
    twitter?: string;
  };
  priceChange24hPercent: number;
  liquidity: number;
  holder: number;
}

interface SearchBoxProps {
  onSearch?: (value: string) => void;
  onTokenSelect?: (address: string) => void;
  placeholder?: string;
}

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 5;

export function SearchBox({
  onSearch,
  onTokenSelect,
  placeholder = '搜索...',
}: SearchBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [wallets, setWallets] = useState<SearchResult[]>([]);

  // 从本地存储加载搜索历史
  useEffect(() => {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (history) {
      setRecentSearches(JSON.parse(history));
    }
  }, []);

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addToSearchHistory = (searchItem: SearchResult) => {
    const newSearch: SearchResult = {
      id: Date.now().toString(),
      type: 'recent',
      name: searchItem.name,
      avatar: searchItem.avatar || '/path/to/avatar',
      address: searchItem.address,
    };

    setRecentSearches((prevSearches) => {
      const filteredSearches = prevSearches.filter(
        (item) => item.address !== searchItem.address
      );
      const newSearches = [newSearch, ...filteredSearches].slice(
        0,
        MAX_HISTORY_ITEMS
      );
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newSearches));
      return newSearches;
    });
  };

  const clearSearchHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch?.('');
  };

  // 创建防抖的搜索函数
  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      if (!value || value.length < 2) {
        setWallets([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/twocat-core/token-overview?address=${value}`
        );
        if (response.ok) {
          const res = await response.json();
          const data: TokenOverview = res.data;
          const formatPrice = (price: number | undefined) =>
            price ? Number(price).toFixed(4) : '0.0000';

          const formatPercent = (percent: number | undefined) =>
            percent ? Number(percent).toFixed(2) : '0.00';

          const formatHolder = (holder: number | undefined) =>
            holder ? Number(holder).toLocaleString() : '0';

          const searchResult: SearchResult = {
            id: data.address,
            type: 'wallet',
            name: data.symbol,
            address: data.address,
            description: `${data.name} • $${formatPrice(
              data.price
            )} (${formatPercent(
              data.priceChange24hPercent
            )}%) • 持有人: ${formatHolder(data.holder)}`,
            avatar: data.logoURI || '/token-placeholder.png',
          };
          console.log(searchResult, 'searchResult');
          setWallets([searchResult]);
        } else {
          setWallets([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setWallets([]);
      } finally {
        setIsLoading(false);
      }
    }, 500), // 500ms 的防抖延迟
    []
  );

  // 在组件卸载时取消防抖
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleChange = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
    onSearch?.(value);
  };

  const handleSelect = (selectedItem: SearchResult) => {
    const searchValue = selectedItem.address || selectedItem.name;
    handleChange(searchValue);
    addToSearchHistory(selectedItem);
    if (selectedItem.address && onTokenSelect) {
      onTokenSelect(selectedItem.address);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <Input
          value={searchValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="bg-[#1E1F22] border-none text-sm pl-9 pr-8 h-8 rounded-md
                    placeholder:text-gray-400 focus-visible:ring-0"
          placeholder={placeholder}
        />
        {isLoading ? (
          <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
        ) : (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
        {searchValue && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 
                       hover:text-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className="absolute w-full mt-2 rounded-md border border-gray-700 
                        bg-[#1E1F22] text-gray-100 shadow-lg outline-none animate-in"
        >
          <Command
            className="rounded-lg border-0 [&_[cmdk-group-heading]]:px-2 
            [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 
            [&_[cmdk-group]]:px-0 
            [&_[cmdk-input-wrapper]_svg]:h-5 
            [&_[cmdk-input-wrapper]_svg]:w-5 
            [&_[cmdk-input]]:h-12 
            [&_[cmdk-item]]:px-2 
            [&_[cmdk-item]]:py-3 
            [&_[cmdk-item]_svg]:h-5 
            [&_[cmdk-item]_svg]:w-5 
            [&_[cmdk-item]]:bg-[#1E1F22] 
            [&_[cmdk-item]]:mx-2
            [&_[cmdk-item]]:rounded-lg
            [&_[cmdk-item]_data-[selected]]:bg-gray-700/50 
            [&_[cmdk-item]:hover]:bg-gray-700/50
            [&_[cmdk-item]]:transition-colors
            [&_[cmdk-item]]:duration-200
            [&_[cmdk-item]]:text-gray-100 
            bg-[#1E1F22]"
          >
            <CommandList>
              {recentSearches.length > 0 && (
                <CommandGroup
                  heading={
                    <span className="text-gray-400 text-xs">最近搜索</span>
                  }
                >
                  <div className="flex flex-wrap gap-2 px-4 py-2">
                    {recentSearches.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                                 bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                      >
                        <Avatar className="h-4 w-4">
                          <img src={item.avatar} alt={item.name} />
                        </Avatar>
                        <span className="text-sm text-gray-200">
                          {item.name}
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={clearSearchHistory}
                      className="flex items-center px-3 py-1.5 rounded-full 
                               bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                    >
                      <span className="text-sm text-gray-400">清除</span>
                    </button>
                  </div>
                </CommandGroup>
              )}

              <CommandGroup
                heading={<span className="text-gray-400 text-xs">代币</span>}
              >
                {isLoading ? (
                  <CommandItem className="flex items-center justify-center py-4 data-[highlighted]:bg-gray-700/50">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  </CommandItem>
                ) : wallets.length > 0 ? (
                  wallets.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center gap-2 px-4 py-2 cursor-pointer data-[highlighted]:bg-gray-700/50 hover:bg-gray-700/50"
                    >
                      <Avatar className="h-6 w-6">
                        <img src={item.avatar} alt={item.name} />
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        <span className="text-sm text-gray-400">
                          {item.description}
                        </span>
                      </div>
                    </CommandItem>
                  ))
                ) : (
                  searchValue &&
                  !isLoading && (
                    <CommandItem className="py-4 text-center text-gray-400">
                      未找到相关代币
                    </CommandItem>
                  )
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
