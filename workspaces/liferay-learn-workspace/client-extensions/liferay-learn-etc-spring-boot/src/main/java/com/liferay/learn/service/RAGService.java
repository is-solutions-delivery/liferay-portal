/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.learn.service;

import com.liferay.client.extension.util.spring.boot3.service.BaseService;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.util.HashMapBuilder;

import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.qdrant.QdrantVectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Nilton Vieira
 */
@Service
public class RAGService extends BaseService {

	public void addOrUpdateDocument(
		long assetEntryId, String assetEntryType, String content, String name) {

		Document document = new Document(
			content,
			HashMapBuilder.<String, Object>put(
				"assetEntryId", assetEntryId
			).put(
				"assetEntryType", assetEntryType
			).put(
				"name", name
			).build());

		List<Document> splittedDocuments = new TokenTextSplitter(
		).split(
			document
		);

		_vectorStore.doAdd(splittedDocuments);
	}

	public String search(String question) {
		List<Document> vectorStoreResult = _vectorStore.doSimilaritySearch(
			SearchRequest.builder(
			).query(
				question
			).topK(
				5
			).similarityThreshold(
				0.6
			).build());

		StringBundler sb = new StringBundler();

		for (Document document : vectorStoreResult) {
			sb.append(
				document.getText()
			).append(
				System.lineSeparator()
			);
		}

		return _chatClient.prompt(
		).user(
			StringBundler.concat(
				"You are the liferay learn assistant to provide accurate ",
				"answers to the question in the QUESTION section. If unsure, ",
				"simply state that you do not know. DOCUMENTS: ", sb,
				"QUESTION: ", question)
		).call(
		).content();
	}

	@Autowired
	private ChatClient _chatClient;

	@Autowired
	private EmbeddingModel _embeddingModel;

	@Autowired
	private QdrantVectorStore _vectorStore;

}