export class DetectionRegexCodes{
    static VariableRegexCode = /₺₺(.*.)₺₺/g;
    static ForLoopFullRegexCode = /₺(for|döngü)\s*\(\s*([\w.]+)\s*,\s*([\w.]+)\s*\)\s*{([\s\S]*?)\}/g;
    static ForLoopHeaderRegexCode = /₺(for|döngü)\s*\(\s*([\w.]+)\s*,\s*([\w.]+)\s*\)/g;
}