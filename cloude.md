# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 규칙

- 코딩하지 말고 먼저 계획부터 제시한다
- 설명은 초보도 이해할 수 있게 한다
- 사용자가 승인하면 그때 코드를 작성한다

## 워크플로우

이 프로젝트는 OpenSpec(spec-driven) 워크플로우를 사용한다. 변경사항을 구현할 때 다음 순서를 따른다:

1. `/opsx:explore` — 아이디어 탐색, 문제 조사, 요구사항 정리
2. `/opsx:propose` — 설계, 스펙, 태스크를 포함한 변경 제안 생성
3. `/opsx:apply` — 태스크 기반으로 구현 진행
4. `/opsx:archive` — 구현 완료 후 변경사항 아카이브
