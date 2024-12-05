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

    const removeQA = (qaIndex: number) => {
        onChange('qas', data.qas.filter((_, i) => i !== qaIndex));
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
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-300">问答</label>
                    <Button
                        type="button"
                        onClick={addQA}
                        className="bg-gradient-to-r from-[#53b991] to-[#9ad499] hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        添加问题
                    </Button>
                </div>

                <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
                    {data.qas.map((qa, qaIndex) => (
                        <div key={qaIndex} className="relative bg-[#2f2f2f]/50 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
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
                                <Button
                                    type="button"
                                    onClick={() => removeQA(qaIndex)}
                                    className="hover:opacity-90 transition-opacity h-10 px-3"
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="pl-6 border-l-2 border-gray-600 space-y-2">
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
                                            onClick={() => removeAnswer(qaIndex, answerIndex)}
                                            className="hover:opacity-90 transition-opacity h-10 px-3"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    onClick={() => addAnswer(qaIndex)}
                                    className="bg-gradient-to-r from-[#53b991] to-[#9ad499] hover:opacity-90 transition-opacity w-full"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    添加答案
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}