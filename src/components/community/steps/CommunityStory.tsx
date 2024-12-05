'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface CommunityStoryProps {
    data: {
        title: string;
        slogan: string;
        description: string;
        qas: {
            question: string;
            answers: string[];
        }[];
    };
    onChange: (field: string, value: any) => void;
}

export function CommunityStory({ data, onChange }: CommunityStoryProps) {
    const addQA = () => {
        onChange('qas', [...data.qas, { question: '', answers: [''] }]);
    };

    const addAnswer = (qaIndex: number) => {
        const newQAs = [...data.qas];
        newQAs[qaIndex].answers.push('');
        onChange('qas', newQAs);
    };

    const removeAnswer = (qaIndex: number, answerIndex: number) => {
        const newQAs = [...data.qas];
        newQAs[qaIndex].answers = newQAs[qaIndex].answers.filter((_, i) => i !== answerIndex);
        onChange('qas', newQAs);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">社区标题</label>
                <Input
                    value={data.title}
                    onChange={(e) => onChange('title', e.target.value)}
                    placeholder="输入社区标题"
                    className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">社区标语</label>
                <Input
                    value={data.slogan}
                    onChange={(e) => onChange('slogan', e.target.value)}
                    placeholder="输入社区标语"
                    className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">社区描述</label>
                <Textarea
                    value={data.description}
                    onChange={(e) => onChange('description', e.target.value)}
                    placeholder="输入社区描述"
                    className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                />
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium text-gray-300">问答</label>
                {data.qas.map((qa, qaIndex) => (
                    <div key={qaIndex} className="space-y-2">
                        <Input
                            value={qa.question}
                            onChange={(e) => {
                                const newQAs = [...data.qas];
                                newQAs[qaIndex].question = e.target.value;
                                onChange('qas', newQAs);
                            }}
                            placeholder="输入问题"
                            className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                        />

                        <div className="space-y-2">
                            {qa.answers.map((answer, answerIndex) => (
                                <div key={answerIndex} className="flex gap-2">
                                    <Input
                                        value={answer}
                                        onChange={(e) => {
                                            const newQAs = [...data.qas];
                                            newQAs[qaIndex].answers[answerIndex] = e.target.value;
                                            onChange('qas', newQAs);
                                        }}
                                        placeholder="输入答案"
                                        className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeAnswer(qaIndex, answerIndex)}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addAnswer(qaIndex)}
                                className="w-full border-[#53b991]/30 hover:bg-[#53b991]/10"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                添加答案
                            </Button>
                        </div>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addQA}
                    className="w-full border-[#53b991]/30 hover:bg-[#53b991]/10"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    添加问答
                </Button>
            </div>
        </div>
    );
}